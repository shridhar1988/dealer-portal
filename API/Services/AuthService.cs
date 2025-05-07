using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using static Ticketing_API.Models.AuthMaster;
using System.Security.Cryptography;
using System.Text;
using Ticketing_API.Models;
using Ticketing_API.DbContexts;
using Ticketing_API.Helpers;

namespace Ticketing_API.Services
{
    public class AuthService
    {
        private readonly IConfiguration _configuration;
        private readonly DealerPortalContext _dbContext;

        public AuthService(IConfiguration configuration, DealerPortalContext dbContext)
        {
            _configuration = configuration;
            _dbContext = dbContext;
        }
        public Client FindClient(string clientId)
        {
            try
            {
                var client = _dbContext.Clients.Find(clientId);
                return client;
            }
            catch (Exception ex)
            {
                ErrorLog.WriteToFile("AuthRepository/FindClient : - ", ex);
                return null;
            }
        }

        public async Task<LoginResult> LoginUser(string UserName, string Password)
        {
            try
            {
                string userId = string.Empty, role = string.Empty;
                List<App> MenuItemList = new List<App>();
                string MenuItemNames = "";
                User user = null;
                var active = false;
                string isChangePasswordRequired = "No";
                string DefaultPassword = _configuration.GetValue<string>("DefaultPassword");
                if (UserName.Contains('@') && UserName.Contains('.'))
                {
                    user = _dbContext.Users.FirstOrDefault(tb => tb.Email == UserName);
                }
                else
                {
                    user = _dbContext.Users.FirstOrDefault(tb => tb.UserName == UserName);
                }

                if (user != null)
                {
                    if (!user.IsActive)
                    {
                        throw new Exception("Account is Disabled");
                    }
                    bool isValidUser = false;
                    var loginResult = new LoginResult();
                    string DecryptedPassword = Decrypt(user.Password, true);
                    isValidUser = DecryptedPassword == Password;

                    if (isValidUser)
                    {
                        if (!user.IsLocked || user.IsLocked && DateTime.Now >= user.IsLockDuration)
                        {
                            user.IsLocked = false;
                            user.Attempts = 0;
                            GC.Collect();
                            GC.WaitForPendingFinalizers();

                            if (user.Pass1 == null)
                            {
                                isChangePasswordRequired = "Yes";
                                loginResult.ReasonForReset = "Please Enter new Password to login";
                            }
                            if (user.ExpiryDate != null && DateTime.Now > user.ExpiryDate)
                            {
                                isChangePasswordRequired = "Yes";
                                loginResult.ReasonForReset = "Your Password has been expired. Please Enter a new Password to login";
                            }
                            Role userRole = (from tb1 in _dbContext.Roles
                                             join tb2 in _dbContext.UserRoleMaps on tb1.RoleID equals tb2.RoleID
                                             join tb3 in _dbContext.Users on tb2.UserID equals tb3.UserID
                                             where tb3.UserID == user.UserID && tb1.IsActive && tb2.IsActive && tb3.IsActive
                                             select tb1).FirstOrDefault();

                            EmpInfo userinfo = await (from tb1 in _dbContext.EmpInfos
                                                      join tb4 in _dbContext.Users on tb1.EmpId equals tb4.UserID
                                                      where tb4.UserID == user.UserID
                                                      select tb1).FirstOrDefaultAsync();
                            if (userRole != null)
                            {
                                MenuItemList = _dbContext.Apps
                                    .Join(_dbContext.RoleAppMaps, app => app.AppID, map => map.AppID, (app, map) => new { app, map })
                                    .Where(j => j.map.RoleID == userRole.RoleID && j.app.IsActive && j.map.IsActive)
                                    .Select(j => j.app)
                                    //.OrderBy(j=>j.AppID)
                                    .ToList();
                            }



                            loginResult.UserID = user.UserID;
                            loginResult.UserName = user.UserName;
                            loginResult.DisplayName = user.UserName;
                            loginResult.EmailAddress = user.Email;
                            loginResult.FirstName = userinfo.FirstName;
                            loginResult.LastName = userinfo.LastName;
                            loginResult.ProfilePic = user.PicDbPath;
                            loginResult.AccountGroup = user.AccountGroup == null ? "" : user.AccountGroup;
                            loginResult.UserRole = userRole != null ? userRole.RoleName : "";
                            loginResult.IsChangePasswordRequired = isChangePasswordRequired;
                            loginResult.menuItemNames = MenuItemList;
                            await _dbContext.SaveChangesAsync();
                            await AddLoginHistory(user.UserID, user.UserName);
                            return loginResult;
                        }
                        else
                        {
                            var reason = "Your Account Has Been Locked Due To Incorrect Password. Please Login After 15 minutes";
                            throw new Exception(reason);
                        }
                    }
                    else
                    {
                        user.Attempts++;
                        var reason = "The user name or password is incorrect.";
                        if (user.Attempts == 5)
                        {
                            user.IsLocked = true;
                            reason = "Your Account Has Been Locked Due To Incorrect Password. Please Login After 15 minutes";
                            user.IsLockDuration = DateTime.Now.AddMinutes(15);
                        }
                        await _dbContext.SaveChangesAsync();
                        throw new Exception(reason);
                    }
                }
                else
                {
                    throw new Exception("The user name or password is incorrect.");
                }
            }
            catch (Exception ex)
            {
                ErrorLog.WriteToFile("AuthorizationServerProvider/GrantResourceOwnerCredentials :- ", ex);
                throw ex;
            }
        }

        public async Task<List<App>> AuthenticateUser(string ClientId, Guid UserId)
        {
            try
            {
                User user = null;
                List<App> MenuItemList = new List<App>();

                if (UserId != null)
                {
                    user = _dbContext.Users.FirstOrDefault(tb => tb.UserID == UserId);
                }
                else
                {
                    throw new Exception("UserId is Must Requied!");
                }

                if (user != null)
                {
                    if (!user.IsActive)
                    {
                        throw new Exception("Account is Disabled");
                    }

                    if (!user.IsLocked)
                    {

                        Role userRole = (from tb1 in _dbContext.Roles
                                         join tb2 in _dbContext.UserRoleMaps on tb1.RoleID equals tb2.RoleID
                                         join tb3 in _dbContext.Users on tb2.UserID equals tb3.UserID
                                         where tb3.UserID == user.UserID && tb1.IsActive && tb2.IsActive && tb3.IsActive
                                         select tb1).FirstOrDefault();

                        EmpInfo userinfo = await (from tb1 in _dbContext.EmpInfos
                                                  join tb4 in _dbContext.Users on tb1.EmpId equals tb4.UserID
                        where tb4.UserID == user.UserID
                        select tb1).FirstOrDefaultAsync();

                        if (userRole != null)
                        {
                            MenuItemList = (from tb1 in _dbContext.Apps
                                            join tb2 in _dbContext.RoleAppMaps on tb1.AppID equals tb2.AppID
                                            where tb2.RoleID == userRole.RoleID && tb1.IsActive && tb2.IsActive
                                            where tb1.ClientId.Contains(ClientId)
                                            select tb1).ToList();
                        }

                        return MenuItemList;
                    }
                    else
                    {
                        var reason = "Your Account Has Been Locked Due To Incorrect Password. Please Login After 15 minutes";
                        throw new Exception(reason);
                    }
                }
                else
                {
                    throw new Exception("The user name Not Found.");
                }
            }
            catch (Exception ex)
            {
                ErrorLog.WriteToFile("AuthorizationServerProvider/GrantResourceOwnerCredentials :- ", ex);
                throw ex;
            }
        }
        public async Task AddLoginHistory(Guid userID, string username)
        {
            try
            {
                var loginData = new UserLoginHistory
                {
                    UserID = userID,
                    UserName = username,
                    LoginTime = DateTime.Now
                };

                _dbContext.UserLoginHistory.Add(loginData);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the app", ex);
            }
        }
        private string Decrypt(string Password, bool UseHashing)
        {
            try
            {
                string EncryptionKey = "Iteos";
                byte[] KeyArray;
                byte[] ToEncryptArray = Convert.FromBase64String(Password);
                if (UseHashing)
                {
                    using (MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider())
                    {
                        KeyArray = hashmd5.ComputeHash(Encoding.UTF8.GetBytes(EncryptionKey));
                    }
                }
                else
                {
                    KeyArray = Encoding.UTF8.GetBytes(EncryptionKey);
                }

                using (TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider())
                {
                    tdes.Key = KeyArray;
                    tdes.Mode = CipherMode.ECB;
                    tdes.Padding = PaddingMode.PKCS7;
                    ICryptoTransform cTransform = tdes.CreateDecryptor();
                    byte[] resultArray = cTransform.TransformFinalBlock(ToEncryptArray, 0, ToEncryptArray.Length);
                    return Encoding.UTF8.GetString(resultArray);
                }
            }
            catch (Exception ex)
            {
                ErrorLog.WriteToFile("AuthorizationServerProvider/Decrypt :- ", ex);
                return null;
            }
        }


    }
}
