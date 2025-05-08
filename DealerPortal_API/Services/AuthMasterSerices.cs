using Microsoft.AspNetCore.Mvc;
using static DealerPortal_API.Models.DealerMaster;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using DealerPortal_API.Helpers;
using DealerPortal_API.Models;
using DealerPortal_API.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace DealerPortal_API.Services
{
    public class AuthMasterSerices
    {
        private readonly IConfiguration _configuration;
        private readonly DealerContext _dbContext;
        private readonly int _tokenTimespan;
        private readonly EmailService _emailService;

        public AuthMasterSerices(IConfiguration configuration, DealerContext dbContext, EmailService emailService)
        {
            _configuration = configuration;
            _dbContext = dbContext;
            _emailService = emailService;
          
            try
            {
                var span = "30";
                if (span != "")
                    _tokenTimespan = Convert.ToInt32(span.ToString());
                if (_tokenTimespan <= 0)
                {
                    _tokenTimespan = 30;
                }
            }
            catch
            {
                _tokenTimespan = 30;
            }
        }

        #region Authentication

        public Client FindClient(string clientId)
        {
            try
            {
                var client = _dbContext.Clients.Find(clientId);
                return client;
            }
            catch (Exception ex)
            {
                // Handle exceptions here or let them bubble up
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<AuthenticationResult> AuthenticateUser(string userName, string password)
        {
            try
            {
                AuthenticationResult authenticationResult = new AuthenticationResult();
                List<App> MenuItemList = new List<App>();
                string menuItemNames = "";
                string isChangePasswordRequired = "No";
                string defaultPassword = _configuration["DefaultPassword"];

                User user = null;
                if (userName.Contains('@') && userName.Contains('.'))
                {
                    user = await _dbContext.Users.FirstOrDefaultAsync(tb => tb.Email == userName && tb.IsActive);
                }
                else
                {
                    user = await _dbContext.Users.FirstOrDefaultAsync(tb => tb.UserName == userName && tb.IsActive);
                }

                if (user != null)
                {
                    bool isValidUser = false;
                    string decryptedPassword = Decrypt(user.Password, true);
                    isValidUser = decryptedPassword == password;
                    if (user.IsLocked && DateTime.Now >= user.IsLockDuration)
                    {
                        user.IsLocked = false;
                    }
                    if (isValidUser && !user.IsLocked)
                    {
                        user.Attempts = 0;
                        GC.Collect();
                        GC.WaitForPendingFinalizers();
                        if (password == defaultPassword)
                        {
                            isChangePasswordRequired = "Yes";
                        }
                        Role userRole = await (from tb1 in _dbContext.Roles
                                               join tb2 in _dbContext.UserRoleMaps on tb1.RoleID equals tb2.RoleID
                                               join tb3 in _dbContext.Users on tb2.UserID equals tb3.UserID
                                               join tb4 in _dbContext.EmpInfos on tb3.UserID equals tb4.EmpId
                                               where tb3.UserID == user.UserID && tb1.IsActive && tb2.IsActive && tb3.IsActive
                                               select tb1).FirstOrDefaultAsync();

                        EmpInfo userinfo = await (from tb1 in _dbContext.EmpInfos
                                                  join tb4 in _dbContext.Users on tb1.EmpId equals tb4.UserID
                                                  where tb4.UserID == user.UserID
                                                  select tb1).FirstOrDefaultAsync();

                        if (userRole != null)
                        {
                            MenuItemList = (from tb1 in _dbContext.Apps
                                            join tb2 in _dbContext.RoleAppMaps on tb1.AppID equals tb2.AppID
                                            where tb2.RoleID == userRole.RoleID && tb1.IsActive && tb2.IsActive
                                            select tb1).ToList();
                        }
                        authenticationResult.IsSuccess = true;
                        authenticationResult.UserID = user.UserID;
                        authenticationResult.UserName = user.UserName;
                        authenticationResult.DisplayName = user.UserName;
                        authenticationResult.EmailAddress = user.Email;
                        authenticationResult.AccountGroup = user.AccountGroup;
                        authenticationResult.FirstName = userinfo.FirstName;
                        authenticationResult.LastName = userinfo.LastName;
                        authenticationResult.ProfilePic = user.PicDbPath;
                        authenticationResult.UserRole = userRole != null ? userRole.RoleName : string.Empty;
                        authenticationResult.MenuItemNames = MenuItemList;
                        authenticationResult.IsChangePasswordRequired = isChangePasswordRequired;
                    }
                    else
                    {
                        authenticationResult.IsSuccess = false;
                        authenticationResult.Message = "The user name or password is incorrect.";
                        user.Attempts++;
                        if (user.Attempts == 5)
                        {
                            user.IsLocked = true;
                            user.IsLockDuration = DateTime.Now.AddMinutes(15);
                            authenticationResult.Message = "Wait for 15 minutes to login";
                        }
                        await _dbContext.SaveChangesAsync();
                    }
                }
                else
                {
                    authenticationResult.IsSuccess = false;
                    authenticationResult.Message = "The user name or password is incorrect.";
                }

                return authenticationResult;
            }
            catch (Exception ex)
            {
                // Handle exceptions here or let them bubble up
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        #endregion

        #region Encrypt&DecryptFuction

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


        private string Encrypt(string Password, bool useHashing)
        {
            try
            {
                string EncryptionKey = "Iteos";
                byte[] KeyArray;
                byte[] ToEncryptArray = Encoding.UTF8.GetBytes(Password);
                if (useHashing)
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
                    ICryptoTransform cTransform = tdes.CreateEncryptor();
                    byte[] resultArray = cTransform.TransformFinalBlock(ToEncryptArray, 0, ToEncryptArray.Length);
                    return Convert.ToBase64String(resultArray, 0, resultArray.Length);
                }
            }
            catch (Exception ex)
            {
                ErrorLog.WriteToFile("AuthorizationServerProvider/Encrypt :- ", ex);
                return null;
            }
        }

        #endregion

        #region UserCreation


        public List<UserWithRole> GetAllUsers(string ClientId)
        {
            try
            {
                var clientcheck = _dbContext.Clients.FirstOrDefault(e => e.Id == ClientId);
                if (clientcheck == null)
                {
                    throw new Exception("ClientId is Not exists");
                }

                var result = (from tb in _dbContext.Users
                              join tb1 in _dbContext.UserRoleMaps on tb.UserID equals tb1.UserID
                              join tb2 in _dbContext.Roles on tb1.RoleID equals tb2.RoleID
                              join tb3 in _dbContext.EmpInfos on tb.UserID equals tb3.EmpId
                              where tb1.IsActive && tb.ClientId == ClientId
                              orderby tb.CreatedOn descending
                              select new
                              {
                                  tb.UserID,
                                  tb.UserName,
                                  tb.Email,
                                  tb.ContactNumber,
                                  tb.Password,
                                  tb.IsActive,
                                  tb.CreatedOn,
                                  tb.ModifiedOn,
                                  tb1.RoleID,
                                  tb2.RoleName,
                                  tb.AccountGroup,
                                  tb.ClientId,
                                  tb3.FirstName,
                                  tb3.LastName,
                                  tb3.DateOfBirth,
                                  tb3.JoiningDate,
                                  tb3.Address
                              }).ToList();

                List<UserWithRole> userWithRoleList = result.Select(record => new UserWithRole
                {
                    UserID = record.UserID,
                    UserName = record.UserName,
                    Email = record.Email,
                    ContactNumber = record.ContactNumber,
                    Password = Decrypt(record.Password, true),
                    IsActive = record.IsActive,
                    RoleName = record.RoleName,
                    CreatedOn = record.CreatedOn,
                    ModifiedOn = record.ModifiedOn,
                    RoleID = record.RoleID,
                    AccountGroup = record.AccountGroup,
                    ClientId = record.ClientId,
                    FirstName = record.FirstName,
                    LastName = record.LastName,
                    Address = record.Address,
                    DateOfBirth = record.DateOfBirth,
                    JoiningDate = record.JoiningDate
                }).ToList();

                return userWithRoleList;
            }
            catch (Exception ex)
            {
                // Handle exceptions here or let them bubble up
                throw new Exception(ex.Message ?? "Network Error");
            }
        }


        public List<UserReffdata> GetAdminUsers(string ClientId)
        {
            try
            {
                var clientcheck = _dbContext.Clients.FirstOrDefault(e => e.Id == ClientId);
                if (clientcheck == null)
                {
                    throw new Exception("ClientId is Not exists");
                }

                var result = (from tb in _dbContext.Users
                              join tb1 in _dbContext.UserRoleMaps on tb.UserID equals tb1.UserID
                              join tb2 in _dbContext.Roles on tb1.RoleID equals tb2.RoleID
                              join tb3 in _dbContext.EmpInfos on tb.UserID equals tb3.EmpId
                              where tb.IsActive && tb1.IsActive && tb2.IsActive && tb2.RoleName.ToLower() == "administrator" && tb.ClientId == ClientId
                              orderby tb.CreatedOn descending
                              select new
                              {
                                  tb.UserID,
                                  tb.UserName,
                                  tb.Email,
                                  tb1.RoleID,
                                  tb2.RoleName,
                                  tb.AccountGroup,
                                  tb.ClientId,
                                  tb3.FirstName,
                                  tb3.LastName,

                              }).ToList();
                List<UserReffdata> userList = result.Select(record => new UserReffdata
                {
                    UserID = record.UserID,
                    UserName = record.UserName,
                    Email = record.Email,
                    RoleName = record.RoleName,
                    RoleID = record.RoleID,
                    AccountGroup = record.AccountGroup,
                    ClientId = record.ClientId,
                    FirstName = record.FirstName,
                    LastName = record.LastName,
                }).ToList();
                return userList;
            }
            catch (Exception ex)
            {
                // Handle exceptions here or let them bubble up
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public List<UserReffdata> GetAllManagerUsers(string ClientId)
        {
            try
            {
                var clientcheck = _dbContext.Clients.FirstOrDefault(e => e.Id == ClientId);
                if (clientcheck == null)
                {
                    throw new Exception("ClientId is Not exists");
                }

                var result = (from tb in _dbContext.Users
                              join tb1 in _dbContext.UserRoleMaps on tb.UserID equals tb1.UserID
                              join tb2 in _dbContext.Roles on tb1.RoleID equals tb2.RoleID
                              join tb3 in _dbContext.EmpInfos on tb.UserID equals tb3.EmpId
                              where tb.IsActive && tb1.IsActive && tb2.IsActive && tb2.RoleName.ToLower() == "manager" && tb.ClientId == ClientId
                              orderby tb.CreatedOn descending
                              select new
                              {
                                  tb.UserID,
                                  tb.UserName,
                                  tb.Email,
                                  tb1.RoleID,
                                  tb2.RoleName,
                                  tb.AccountGroup,
                                  tb.ClientId,
                                  tb3.FirstName,
                                  tb3.LastName,

                              }).ToList();
                List<UserReffdata> userList = result.Select(record => new UserReffdata
                {
                    UserID = record.UserID,
                    UserName = record.UserName,
                    Email = record.Email,
                    RoleName = record.RoleName,
                    RoleID = record.RoleID,
                    AccountGroup = record.AccountGroup,
                    ClientId = record.ClientId,
                    FirstName = record.FirstName,
                    LastName = record.LastName,
                }).ToList();
                return userList;
            }
            catch (Exception ex)
            {
                // Handle exceptions here or let them bubble up
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public List<UserReffdata> GetAllEmpUsers(string ClientId)
        {
            try
            {
                var clientcheck = _dbContext.Clients.FirstOrDefault(e => e.Id == ClientId);
                if (clientcheck == null)
                {
                    throw new Exception("ClientId is Not exists");
                }
                var result = (from tb in _dbContext.Users
                              join tb1 in _dbContext.UserRoleMaps on tb.UserID equals tb1.UserID
                              join tb2 in _dbContext.Roles on tb1.RoleID equals tb2.RoleID
                              join tb3 in _dbContext.EmpInfos on tb.UserID equals tb3.EmpId
                              where tb.IsActive && tb1.IsActive && tb2.IsActive && tb2.RoleName.ToLower() == "user" && tb.ClientId == ClientId
                              orderby tb.CreatedOn descending
                              select new
                              {
                                  tb.UserID,
                                  tb.UserName,
                                  tb.Email,
                                  tb1.RoleID,
                                  tb2.RoleName,
                                  tb.AccountGroup,
                                  tb.ClientId,
                                  tb3.FirstName,
                                  tb3.LastName,

                              }).ToList();
                List<UserReffdata> userList = result.Select(record => new UserReffdata
                {
                    UserID = record.UserID,
                    UserName = record.UserName,
                    Email = record.Email,
                    RoleName = record.RoleName,
                    RoleID = record.RoleID,
                    AccountGroup = record.AccountGroup,
                    ClientId = record.ClientId,
                    FirstName = record.FirstName,
                    LastName = record.LastName,
                }).ToList();
                return userList;
            }
            catch (Exception ex)
            {
                // Handle exceptions here or let them bubble up
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<List<EmpInfo>> GetAllEmpInfo()
        {
            return await _dbContext.EmpInfos.ToListAsync();
        }

        public async Task<EmpInfo> GetEmpInfoById(Guid id)
        {
            try
            {
                var empInfo = await _dbContext.EmpInfos.FindAsync(id);
                if (empInfo == null)
                {
                    throw new Exception("Employee not found!");
                }

                return empInfo;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<EmpInfo> UpdateFromEmployeeEmpInfo(FromEmployeeEmpInfo empInfo)
        {
            try
            {
                var existingEmp = await _dbContext.EmpInfos.FindAsync(empInfo.EmpId);
                if (existingEmp == null)
                {
                    throw new Exception("User Not Found");
                }

                existingEmp.FirstName = empInfo.FirstName;
                existingEmp.LastName = empInfo.LastName;
                existingEmp.Address = empInfo.Address;
                existingEmp.Mobile = empInfo.Mobile;
                existingEmp.DateOfBirth = empInfo.DateOfBirth;
                existingEmp.ModifiedBy = empInfo.ModifiedBy;
                existingEmp.ModifiedOn = DateTime.Now;


                await _dbContext.SaveChangesAsync();
                return existingEmp;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<UserWithRole> CreateUser(UserWithRole userWithRole)
        {
            try
            {
                var clientcheck = _dbContext.Clients.FirstOrDefault(e => e.Id == userWithRole.ClientId);
                if (clientcheck == null)
                {
                    throw new Exception("ClientId is Not exists");
                }

                string portalAddress = _configuration["SiteURL"];

                // Check if the user with the same username already exists
                var existingUserByUsername = _dbContext.Users.FirstOrDefault(tb1 => tb1.UserName == userWithRole.UserName && tb1.IsActive);
                if (existingUserByUsername != null)
                {
                    throw new Exception("User with the same username already exists");
                }

                // Check if the user with the same email already exists
                var existingUserByEmail = _dbContext.Users.FirstOrDefault(tb1 => tb1.Email == userWithRole.Email && tb1.IsActive);
                if (existingUserByEmail != null)
                {
                    throw new Exception("User with the same email address already exists");
                }

                string filePath1 = null;
                string dbfilePath1 = null;
                if (userWithRole.ProfilePic != null)
                {
                    string folderPath = _configuration["FolderPath"];
                    string foldername = _configuration["FolderName"];
                    string portalAddresslink = _configuration["ApiURL"];
                    // Save new profile picture
                    var fileName = $"{Guid.NewGuid()}_{userWithRole.ProfilePic.FileName}";
                    filePath1 = Path.Combine(folderPath, fileName);
                    dbfilePath1 = portalAddresslink + Path.Combine(foldername, fileName);

                    using (var stream = new FileStream(filePath1, FileMode.Create))
                    {
                        await userWithRole.ProfilePic.CopyToAsync(stream);
                    }
                }

                // Creating User
                User user = new User
                {
                    UserID = Guid.NewGuid(),
                    UserName = userWithRole.UserName,
                    Email = userWithRole.Email,
                    Password = Encrypt(userWithRole.Password, true),
                    AccountGroup = userWithRole.AccountGroup,
                    Company = userWithRole.AccountGroup,//here takeing company from UI in Account group
                    Plant =userWithRole.JoiningDate,//here takeing plant from UI in joingdate
                    ContactNumber = userWithRole.ContactNumber,
                    ClientId = userWithRole.ClientId,
                    CreatedBy = userWithRole.CreatedBy,
                    IsActive = true,
                    CreatedOn = DateTime.Now,
                    IsLocked = false,
                    Attempts = 0,
                    ExpiryDate = DateTime.Now.AddDays(90),
                    ProfilePath = filePath1,
                    PicDbPath = dbfilePath1
                };
                _dbContext.Users.Add(user);
                await _dbContext.SaveChangesAsync();

                EmpInfo empinfo = new EmpInfo
                {
                    EmpId = user.UserID,
                    FirstName = userWithRole.FirstName,
                    LastName = userWithRole.LastName,
                    Address = userWithRole.Address,
                    DateOfBirth = userWithRole.DateOfBirth,
                    JoiningDate = userWithRole.JoiningDate,///here plant
                    Department = userWithRole.AccountGroup,
                    Email = userWithRole.Email,
                    Mobile = userWithRole.ContactNumber,
                    Plant = userWithRole.JoiningDate, //here takeing plant from UI in joingdate
                    IsActive = true,
                    CreatedBy = userWithRole.CreatedBy,
                    CreatedOn = DateTime.Now
                };
                _dbContext.EmpInfos.Add(empinfo);
                await _dbContext.SaveChangesAsync();

                UserRoleMap userRole = new UserRoleMap
                {
                    RoleID = userWithRole.RoleID,
                    UserID = user.UserID,
                    IsActive = true,
                    CreatedOn = DateTime.Now
                };
                _dbContext.UserRoleMaps.Add(userRole);
                await _dbContext.SaveChangesAsync();

                UserWithRole userResult = new UserWithRole
                {
                    UserName = user.UserName,
                    Email = user.Email,
                    ContactNumber = user.ContactNumber,
                    UserID = user.UserID,
                    Password = user.Password,
                    RoleID = userRole.RoleID
                };

                // Send initialization email
                var emailResult = await _emailService.SendInitializationMail(userResult.UserName, userResult.Email, Decrypt(userResult.Password, true), portalAddress);
                if (!emailResult)
                {
                    throw new Exception("Failed to send email");
                }

                return userResult;
            }
            catch (Exception ex)
            {
                // Handle exceptions here or let them bubble up
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<string> ProfileUpdateUser(UserProfileUpdate userProfileUpdate)
        {
            try
            {


                var user1 = await _dbContext.Users.FirstOrDefaultAsync(tb1 => tb1.UserID == userProfileUpdate.UserID && tb1.IsActive);

                if (user1 != null)
                {
                    string NewfilePath1 = null;
                    string NewdbfilePath1 = null;
                    if (userProfileUpdate.ProfilePic != null)
                    {

                        if (user1.ProfilePath != null)
                        {
                            var filePath = user1.ProfilePath;
                            if (File.Exists(filePath))
                            {
                                File.Delete(filePath);
                            }
                        }

                        if (userProfileUpdate.ProfilePic != null)
                        {
                            string folderPath = _configuration["FolderPath"];
                            string foldername = _configuration["FolderName"];
                            string portalAddresslink = _configuration["ApiURL"];
                            // Save new profile picture
                            var fileName = $"{Guid.NewGuid()}_{userProfileUpdate.ProfilePic.FileName}";
                            NewfilePath1 = Path.Combine(folderPath, fileName);
                            NewdbfilePath1 = portalAddresslink + Path.Combine(foldername, fileName);

                            using (var stream = new FileStream(NewfilePath1, FileMode.Create))
                            {
                                await userProfileUpdate.ProfilePic.CopyToAsync(stream);
                            }
                        }
                        user1.ProfilePath = NewfilePath1;
                        user1.PicDbPath = NewdbfilePath1;
                        user1.ModifiedOn = DateTime.Now;
                        user1.ModifiedBy = userProfileUpdate.ModifiedBy;
                    }
                    await _dbContext.SaveChangesAsync();
                    return NewdbfilePath1;
                }
                else
                {
                    throw new Exception("User is Not exist or Not Active");
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions here or let them bubble up
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<UserWithRole> UpdateUser(UserWithRole userWithRole)
        {
            try
            {
                var clientcheck = _dbContext.Clients.FirstOrDefault(e => e.Id == userWithRole.ClientId);
                if (clientcheck == null)
                {
                    throw new Exception("ClientId is Not exists");
                }

                UserWithRole userResult = new UserWithRole();

                var user1 = await _dbContext.Users.FirstOrDefaultAsync(tb1 => tb1.UserName == userWithRole.UserName && tb1.IsActive && tb1.UserID != userWithRole.UserID);

                if (user1 == null)
                {
                    var user2 = await _dbContext.Users.FirstOrDefaultAsync(tb1 => tb1.Email == userWithRole.Email && tb1.IsActive && tb1.UserID != userWithRole.UserID);

                    if (user2 == null)
                    {
                        var user = await _dbContext.Users.FirstOrDefaultAsync(tb => tb.IsActive && tb.UserID == userWithRole.UserID && tb.ClientId == userWithRole.ClientId);
                        if (user != null)
                        {
                            user.UserName = userWithRole.UserName;
                            user.Email = userWithRole.Email;
                            user.Password = Encrypt(userWithRole.Password, true);
                            user.AccountGroup = userWithRole.AccountGroup;
                            user.ContactNumber = userWithRole.ContactNumber;
                            user.ClientId = userWithRole.ClientId;
                            user.IsActive = true;
                            user.ModifiedOn = DateTime.Now;
                            user.ModifiedBy = userWithRole.ModifiedBy;

                            if (userWithRole.ProfilePic != null)
                            {

                                if (user.ProfilePath != null)
                                {
                                    var filePath = user.ProfilePath;
                                    if (File.Exists(filePath))
                                    {
                                        File.Delete(filePath);
                                    }
                                }
                                string NewfilePath1 = null;
                                string NewdbfilePath1 = null;
                                if (userWithRole.ProfilePic != null)
                                {
                                    string folderPath = _configuration["FolderPath"];
                                    string foldername = _configuration["FolderName"]; 
                                    string portalAddresslink = _configuration["ApiURL"];
                                    // Save new profile picture
                                    var fileName = $"{Guid.NewGuid()}_{userWithRole.ProfilePic.FileName}";
                                    NewfilePath1 = Path.Combine(folderPath, fileName);
                                    NewdbfilePath1 = portalAddresslink + Path.Combine(foldername, fileName);

                                    using (var stream = new FileStream(NewfilePath1, FileMode.Create))
                                    {
                                        await userWithRole.ProfilePic.CopyToAsync(stream);
                                    }
                                }
                                user.ProfilePath = NewfilePath1;
                                user.PicDbPath = NewdbfilePath1;
                            }


                            await _dbContext.SaveChangesAsync();

                            //update Empinfo
                            EmpInfo empinfo = _dbContext.EmpInfos.FirstOrDefault(x => x.EmpId == userWithRole.UserID);
                            if (empinfo != null)
                            {
                                empinfo.Address = userWithRole.Address;
                                empinfo.DateOfBirth = userWithRole.DateOfBirth;
                                empinfo.FirstName = userWithRole.FirstName;
                                empinfo.LastName = userWithRole.LastName;
                                empinfo.Email = userWithRole.Email;
                                empinfo.Department = userWithRole.AccountGroup;
                                empinfo.Mobile = userWithRole.ContactNumber;
                                empinfo.JoiningDate = userWithRole.JoiningDate;
                                empinfo.ModifiedBy = userWithRole.ModifiedBy;
                                empinfo.ModifiedOn = userWithRole.ModifiedOn;
                                empinfo.IsActive = userWithRole.IsActive;
                            }
                            await _dbContext.SaveChangesAsync();



                            // Update User's role
                            UserRoleMap oldUserRole = _dbContext.UserRoleMaps.FirstOrDefault(x => x.UserID == userWithRole.UserID && x.IsActive);
                            if (oldUserRole != null && oldUserRole.RoleID != userWithRole.RoleID)
                            {
                                _dbContext.UserRoleMaps.Remove(oldUserRole);
                                await _dbContext.SaveChangesAsync();

                                UserRoleMap userRole = new UserRoleMap()
                                {
                                    RoleID = userWithRole.RoleID,
                                    UserID = user.UserID,
                                    IsActive = true,
                                    CreatedBy = userWithRole.ModifiedBy,
                                    CreatedOn = DateTime.Now,
                                };
                                _dbContext.UserRoleMaps.Add(userRole);
                                await _dbContext.SaveChangesAsync();

                                userResult.UserName = user.UserName;
                                userResult.Email = user.Email;
                                userResult.ContactNumber = user.ContactNumber;
                                userResult.UserID = user.UserID;
                                userResult.Password = user.Password;
                                userResult.RoleID = userRole.RoleID;
                            }
                        }
                    }
                    else
                    {
                        throw new Exception("User with the same email address already exists");
                    }
                }
                else
                {
                    throw new Exception("User with the same name already exists");
                }

                return userResult;
            }
            catch (Exception ex)
            {
                // Handle exceptions here or let them bubble up
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<UserWithRole> DeleteUser(string ClientId, Guid UserID)
        {
            try
            {
                var clientcheck = _dbContext.Clients.FirstOrDefault(e => e.Id == ClientId);
                if (clientcheck == null)
                {
                    throw new Exception("ClientId is Not exists");
                }

                UserWithRole userResult = new UserWithRole();
                var user = await _dbContext.Users.FirstOrDefaultAsync(tb => tb.IsActive && tb.UserID == UserID && tb.ClientId == ClientId);
                if (user != null)
                {
                    _dbContext.Users.Remove(user);
                    await _dbContext.SaveChangesAsync();

                    // Delete User's role
                    UserRoleMap userRole = _dbContext.UserRoleMaps.FirstOrDefault(x => x.UserID == UserID && x.IsActive);
                    if (userRole != null)
                    {
                        _dbContext.UserRoleMaps.Remove(userRole);
                        await _dbContext.SaveChangesAsync();
                    }

                    userResult.UserName = user.UserName;
                    userResult.Email = user.Email;
                    userResult.ContactNumber = user.ContactNumber;
                    userResult.UserID = user.UserID;
                    userResult.Password = user.Password;
                    userResult.RoleID = userRole.RoleID;
                }
                return userResult;
            }
            catch (Exception ex)
            {
                // Handle exceptions here or let them bubble up
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        #endregion

        #region RoleCreation

        public List<RoleWithApp> GetAllRoles(string ClientId)
        {
            try
            {
                var clientcheck = _dbContext.Clients.FirstOrDefault(e => e.Id == ClientId);
                if (clientcheck == null)
                {
                    throw new Exception("ClientId is Not exists");
                }

                List<RoleWithApp> RoleWithAppList = new List<RoleWithApp>();

                List<Role> RoleList = (from tb in _dbContext.Roles
                                       where tb.IsActive && tb.ClientId == ClientId
                                       orderby tb.CreatedOn descending
                                       select tb).ToList();

                foreach (Role rol in RoleList)
                {
                    RoleWithAppList.Add(new RoleWithApp()
                    {
                        RoleID = rol.RoleID,
                        RoleName = rol.RoleName,
                        IsActive = rol.IsActive,
                        CreatedOn = rol.CreatedOn,
                        ClientId = rol.ClientId,
                        ModifiedOn = rol.ModifiedOn,
                        AppIDList = _dbContext.RoleAppMaps
                            .Where(x => x.RoleID == rol.RoleID && x.IsActive)
                            .Select(r => r.AppID)
                            .ToArray()
                    });
                }

                return RoleWithAppList;
            }
            catch (Exception ex)
            {
                // Handle exceptions here or let them bubble up
                throw new Exception(ex.Message ?? "Network Error");
            }
        }


        public List<RoleWithAppView> GetAllRolesWithApp(string ClientId)
        {
            try
            {
                var clientcheck = _dbContext.Clients.FirstOrDefault(e => e.Id == ClientId);
                if (clientcheck == null)
                {
                    throw new Exception("ClientId is Not exists");
                }

                List<RoleWithAppView> RoleWithAppList = new List<RoleWithAppView>();
                HashSet<Guid> uniqueRoleIDs = new HashSet<Guid>();  // To track unique RoleIDs

                List<Role> RoleList = (from tb in _dbContext.Roles
                                       join tb1 in _dbContext.RoleAppMaps on tb.RoleID equals tb1.RoleID
                                       join tb2 in _dbContext.Apps on tb1.AppID equals tb2.AppID
                                       where tb.IsActive && tb.ClientId == ClientId
                                       orderby tb.CreatedOn descending
                                       select tb).ToList();

                foreach (Role rol in RoleList)
                {
                    // Check if the RoleID is already processed
                    if (uniqueRoleIDs.Contains(rol.RoleID))
                    {
                        continue;  // Skip processing if already added
                    }

                    List<int> appIDList = _dbContext.RoleAppMaps
                        .Where(x => x.RoleID == rol.RoleID && x.IsActive)
                        .Select(r => r.AppID)
                        .ToList();

                    List<string> appNameList = _dbContext.Apps
                        .Where(app => appIDList.Contains(app.AppID))
                        .Select(app => app.AppName)
                        .ToList();

                    RoleWithAppList.Add(new RoleWithAppView()
                    {
                        RoleID = rol.RoleID,
                        RoleName = rol.RoleName,
                        IsActive = rol.IsActive,
                        CreatedOn = rol.CreatedOn,
                        ClientId = rol.ClientId,
                        CreatedBy = rol.CreatedBy,
                        ModifiedOn = rol.ModifiedOn,
                        ModifiedBy = rol.ModifiedBy,
                        AppIDList = appIDList.ToArray(),
                        AppNames = string.Join(", ", appNameList)
                    });

                    // Add the processed RoleID to the HashSet
                    uniqueRoleIDs.Add(rol.RoleID);
                }

                return RoleWithAppList;
            }
            catch (Exception ex)
            {
                // Handle exceptions here or let them bubble up
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<RoleWithApp> CreateRole(RoleWithApp roleWithApp)
        {
            try
            {
                var clientcheck = _dbContext.Clients.FirstOrDefault(e => e.Id == roleWithApp.ClientId);
                if (clientcheck == null)
                {
                    throw new Exception("ClientId is Not exists");
                }

                // Check if the role with the same name already exists
                bool roleExists = await _dbContext.Roles
                    .AnyAsync(tb => tb.IsActive && tb.RoleName == roleWithApp.RoleName);

                if (roleExists)
                {
                    throw new Exception("Role with the same name already exists");
                }

                Role role = new Role
                {
                    RoleID = Guid.NewGuid(),
                    RoleName = roleWithApp.RoleName,
                    CreatedOn = DateTime.Now,
                    CreatedBy = roleWithApp.CreatedBy,
                    ClientId = roleWithApp.ClientId,
                    IsActive = true
                };

                _dbContext.Roles.Add(role);

                // Save changes to add the new role
                await _dbContext.SaveChangesAsync();

                // Add role-app mappings
                foreach (int AppID in roleWithApp.AppIDList)
                {
                    RoleAppMap roleApp = new RoleAppMap
                    {
                        AppID = AppID,
                        RoleID = role.RoleID,
                        IsActive = true,
                        CreatedOn = DateTime.Now
                    };

                    _dbContext.RoleAppMaps.Add(roleApp);
                }

                // Save changes to add role-app mappings
                await _dbContext.SaveChangesAsync();

                // Return the created role with apps
                return new RoleWithApp
                {
                    RoleID = role.RoleID,
                    RoleName = role.RoleName,
                    IsActive = role.IsActive,
                    CreatedOn = role.CreatedOn,
                    ModifiedOn = role.ModifiedOn,
                    AppIDList = roleWithApp.AppIDList,
                    ClientId = roleWithApp.ClientId
                };
            }
            catch (Exception ex)
            {
                // Log the exception if needed
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<RoleWithApp> UpdateRole(RoleWithApp roleWithApp)
        {
            try
            {
                var clientcheck = _dbContext.Clients.FirstOrDefault(e => e.Id == roleWithApp.ClientId);
                if (clientcheck == null)
                {
                    throw new Exception("ClientId is Not exists");
                }

                // Check if the role with the same name already exists and has a different ID
                bool roleExists = await _dbContext.Roles
                    .AnyAsync(tb => tb.IsActive && tb.RoleName == roleWithApp.RoleName && tb.RoleID != roleWithApp.RoleID && tb.ClientId == roleWithApp.ClientId);

                if (roleExists)
                {
                    throw new Exception("Role with the same name already exists");
                }

                // Find the role to update
                Role role = await _dbContext.Roles
                    .FirstOrDefaultAsync(tb => tb.IsActive && tb.RoleID == roleWithApp.RoleID && tb.ClientId == roleWithApp.ClientId);

                if (role != null)
                {
                    role.RoleName = roleWithApp.RoleName;
                    role.ClientId = roleWithApp.ClientId;
                    role.IsActive = true;
                    role.ModifiedOn = DateTime.Now;
                    role.ModifiedBy = roleWithApp.ModifiedBy;

                    // Save changes to update the role
                    await _dbContext.SaveChangesAsync();

                    // Get the existing role-app mappings
                    List<RoleAppMap> oldRoleAppList = await _dbContext.RoleAppMaps
                        .Where(x => x.RoleID == roleWithApp.RoleID && x.IsActive)
                        .ToListAsync();

                    // Identify role-app mappings that need to be removed
                    List<RoleAppMap> needToRemoveRoleAppList = oldRoleAppList
                        .Where(x => !roleWithApp.AppIDList.Any(y => y == x.AppID))
                        .ToList();

                    // Identify apps to be added to the role
                    List<int> needToAddAppList = roleWithApp.AppIDList
                        .Where(x => !oldRoleAppList.Any(y => y.AppID == x))
                        .ToList();

                    // Delete old role-app mappings
                    _dbContext.RoleAppMaps.RemoveRange(needToRemoveRoleAppList);
                    await _dbContext.SaveChangesAsync();

                    // Create new role-app mappings
                    foreach (int appID in needToAddAppList)
                    {
                        RoleAppMap roleApp = new RoleAppMap()
                        {
                            AppID = appID,
                            RoleID = role.RoleID,
                            IsActive = true,
                            CreatedOn = DateTime.Now,
                        };

                        _dbContext.RoleAppMaps.Add(roleApp);
                    }

                    // Save changes to add new role-app mappings
                    await _dbContext.SaveChangesAsync();

                    return new RoleWithApp
                    {
                        RoleID = roleWithApp.RoleID,
                        RoleName = roleWithApp.RoleName,
                        AppIDList = roleWithApp.AppIDList,
                        ClientId = roleWithApp.ClientId,
                    };
                }
                else
                {
                    throw new Exception("Role not found");
                }
            }
            catch (Exception ex)
            {
                // Log the exception if needed
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<RoleWithApp> DeleteRole(Guid roleId)
        {
            try
            {
                var roleToDelete = await _dbContext.Roles.FindAsync(roleId);

                if (roleToDelete == null)
                {
                    throw new ArgumentException("Role not found");
                }

                _dbContext.Roles.Remove(roleToDelete);
                await _dbContext.SaveChangesAsync();

                // Change the status of the RoleApps related to the role
                var roleAppList = await _dbContext.RoleAppMaps
                    .Where(x => x.RoleID == roleId && x.IsActive)
                    .ToListAsync();

                _dbContext.RoleAppMaps.RemoveRange(roleAppList);
                await _dbContext.SaveChangesAsync();

                // Map the deleted role to a RoleWithApp object and return it
                var deletedRoleWithApp = new RoleWithApp
                {
                    RoleID = roleToDelete.RoleID,
                    RoleName = roleToDelete.RoleName
                };

                return deletedRoleWithApp;
            }
            catch (Exception ex)
            {
                // Log the exception if needed
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        #endregion

        #region AppControll


        public List<App> GetAllApps()
        {
            try
            {
                var apps = _dbContext.Apps
                    .Where(app => app.IsActive)
                    .ToList();

                return apps;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<App> CreateApp(App app)
        {
            try
            {

                var existingApp = await _dbContext.Apps
                    .FirstOrDefaultAsync(a => a.IsActive && a.AppName == app.AppName);

                if (existingApp != null)
                {
                    throw new InvalidOperationException("An app with the same name already exists");
                }

                app.CreatedOn = DateTime.Now;
                app.IsActive = true;
                _dbContext.Apps.Add(app);
                await _dbContext.SaveChangesAsync();

                return app;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<App> UpdateApp(App app)
        {
            try
            {

                var existingApp = await _dbContext.Apps
                    .FirstOrDefaultAsync(a => a.IsActive && a.AppName == app.AppName && a.AppID != app.AppID);

                if (existingApp != null)
                {
                    throw new InvalidOperationException("An app with the same name already exists");
                }

                var appToUpdate = await _dbContext.Apps
                    .FirstOrDefaultAsync(a => a.IsActive && a.AppID == app.AppID);

                if (appToUpdate == null)
                {
                    throw new Exception("App not found");
                }

                appToUpdate.AppName = app.AppName;
                appToUpdate.AppRoute = app.AppRoute;
                appToUpdate.IsActive = true;
                appToUpdate.ModifiedOn = DateTime.Now;
                appToUpdate.ModifiedBy = app.ModifiedBy;

                await _dbContext.SaveChangesAsync();

                return app;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<App> DeleteApp(App app)
        {
            try
            {
                var appToDelete = await _dbContext.Apps
                    .FirstOrDefaultAsync(a => a.IsActive && a.AppID == app.AppID);

                if (appToDelete == null)
                {
                    throw new Exception("App not found");
                }

                _dbContext.Apps.Remove(appToDelete);
                await _dbContext.SaveChangesAsync();

                return appToDelete;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        #endregion

        #region AddLoginHistoryControll

        public async Task<UserLoginHistory> AddLoginHistory(Guid userID, string username)
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

                return loginData;

            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the app", ex);
            }
        }

        public List<UserLoginHistory> GetAllUsersLoginHistory()
        {

            try
            {

                return _dbContext.UserLoginHistory
               .OrderByDescending(login => login.LoginTime)
               .ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the app", ex);

            }
        }

        public List<UserLoginHistory> GetCurrentUserLoginHistory(Guid userID)
        {
            try
            {

                return _dbContext.UserLoginHistory
                    .Where(login => login.UserID == userID)
                    .OrderByDescending(login => login.LoginTime)
                    .ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the app", ex);

            }
        }

        public async Task<UserLoginHistory> SignOut(Guid userID)
        {

            try
            {
                var result = await _dbContext.UserLoginHistory
                .Where(data => data.UserID == userID)
                .OrderByDescending(data => data.LoginTime)
                .FirstOrDefaultAsync();

                if (result != null)
                {
                    result.LogoutTime = DateTime.Now;
                    await _dbContext.SaveChangesAsync();
                }

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the app", ex);

            }
        }

        #endregion

        #region PasswordChangeOption

        public async Task<User> ChangePassword(ChangePassword changePassword)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserName == changePassword.UserName && u.IsActive);

            if (user == null)
            {
                throw new Exception("User does not exist.");
            }

            string decryptedPassword = Decrypt(user.Password, true);

            if (decryptedPassword != changePassword.CurrentPassword)
            {
                throw new Exception("Current password is incorrect.");
            }

            string defaultPassword = changePassword.CurrentPassword;

            bool isNewPasswordRepeated = Enumerable.Range(1, 5)
                .Any(i => Decrypt(GetPropertyValue(user, $"Pass{i}"), true) == changePassword.NewPassword);

            if (changePassword.NewPassword == defaultPassword || isNewPasswordRepeated)
            {
                throw new Exception("New password should not be the same as the previous 5 passwords.");
            }

            string previousPassword = user.Password;
            user.Password = Encrypt(changePassword.NewPassword, true);
            var index = user.LastChangedPassword;
            var lastchangedIndex = 0;

            //To find lastchangedpassword
            if (!string.IsNullOrEmpty(index))
            {
                if (user.Pass1 != null)
                {
                    var strings = "user.Pass1";
                    if (strings.Contains(index))
                    {
                        lastchangedIndex = 2;
                    }
                }
                if (user.Pass2 != null)
                {
                    var strings = "user.Pass2";
                    if (strings.Contains(index))
                    {
                        lastchangedIndex = 3;
                    }
                }
                if (user.Pass3 != null)
                {
                    var strings = "user.Pass3";
                    if (strings.Contains(index))
                    {
                        lastchangedIndex = 4;
                    }
                }
                if (user.Pass4 != null)
                {
                    var strings = "user.Pass4";
                    if (strings.Contains(index))
                    {
                        lastchangedIndex = 5;
                    }
                }
                if (user.Pass5 != null)
                {
                    var strings = "user.Pass5";
                    if (strings.Contains(index))
                    {
                        lastchangedIndex = 1;
                    }
                }
            }

            if (lastchangedIndex <= 0)
            {
                lastchangedIndex = 1;
            }

            // TO change previous password
            if (lastchangedIndex == 1)
            {
                user.Pass1 = previousPassword;
            }
            else if (lastchangedIndex == 2)
            {
                user.Pass2 = previousPassword;
            }
            else if (lastchangedIndex == 3)
            {
                user.Pass3 = previousPassword;
            }
            else if (lastchangedIndex == 4)
            {
                user.Pass4 = previousPassword;
            }
            else if (lastchangedIndex == 5)
            {
                user.Pass5 = previousPassword;
            }

            user.LastChangedPassword = lastchangedIndex.ToString();
            user.IsActive = true;
            user.ModifiedOn = DateTime.Now;
            user.ExpiryDate = DateTime.Now.AddDays(90);

            await _dbContext.SaveChangesAsync();

            return user;
        }

        private string GetPropertyValue(object obj, string propertyName)
        {
            return obj.GetType().GetProperty(propertyName)?.GetValue(obj)?.ToString();
        }

        public async Task<AuthTokenHistory> SendResetLinkToMail(EmailModel emailModel)
        {
            try
            {
                DateTime ExpireDateTime = DateTime.Now.AddMinutes(_tokenTimespan);

                User user = _dbContext.Users.FirstOrDefault(tb => tb.Email == emailModel.EmailAddress && tb.IsActive);

                if (user == null)
                {
                    throw new Exception($"User name {emailModel.EmailAddress} is not registered!");
                }

                string code = Encrypt(user.UserID.ToString() + '|' + user.UserName + '|' + ExpireDateTime, true);

                bool sendresult = await _emailService.SendMail(HttpUtility.UrlEncode(code), user.UserName, user.Email, user.UserID.ToString(), emailModel.siteURL);

                if (!sendresult)
                {
                    throw new Exception("Sorry! There is some problem on sending mail");
                }

                var history1 = _dbContext.AuthTokenHistories.FirstOrDefault(tb => tb.UserID == user.UserID && !tb.IsUsed);

                if (history1 == null)
                {
                    AuthTokenHistory history = new AuthTokenHistory()
                    {
                        UserID = user.UserID,
                        Token = code,
                        UserName = user.UserName,
                        EmailAddress = user.Email,
                        CreatedOn = DateTime.Now,
                        ExpireOn = ExpireDateTime,
                        IsUsed = false,
                        Comment = "Reset Token sent successfully"
                    };
                    _dbContext.AuthTokenHistories.Add(history);
                }
                else
                {
                    ErrorLog.WriteToFile("ResetPasswordLink/SendLinkToMail : Token already present, updating new token to the user whose mail id is " + user.Email);
                    history1.Token = code;
                    history1.CreatedOn = DateTime.Now;
                    history1.ExpireOn = ExpireDateTime;
                }

                await _dbContext.SaveChangesAsync();

                return history1;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<ActionResult<AuthTokenHistory>> ForgotPassword(ForgotPassword forgotPassword)
        {
            string[] decryptedArray = new string[3];
            AuthTokenHistory tokenHistoryResult = new AuthTokenHistory();

            try
            {
                string result = Decrypt(forgotPassword.Token, true);

                if (result.Contains('|') && result.Split('|').Length == 3)
                {
                    decryptedArray = result.Split('|');
                }
                else
                {
                    throw new Exception("Invalid token!");
                }

                if (decryptedArray.Length == 3)
                {
                    DateTime date = DateTime.Parse(decryptedArray[2].Replace('+', ' '));

                    if (DateTime.Now > date)
                    {
                        throw new Exception("Token Expired");
                    }

                    var DecryptedUserID = decryptedArray[0];

                    User user = await _dbContext.Users.FirstOrDefaultAsync(tb => tb.UserID.ToString() == DecryptedUserID && tb.IsActive);

                    if (user != null && user.UserName == decryptedArray[1] && forgotPassword.UserID == user.UserID)
                    {
                        string DefaultPassword = Decrypt(user.Password, true);

                        AuthTokenHistory history = await _dbContext.AuthTokenHistories.FirstOrDefaultAsync(x => x.UserID == user.UserID && !x.IsUsed && x.Token == forgotPassword.Token);

                        if (history != null)
                        {
                            if (forgotPassword.NewPassword == DefaultPassword || user.Pass1 != null && Decrypt(user.Pass1, true) == forgotPassword.NewPassword || user.Pass2 != null && Decrypt(user.Pass2, true) == forgotPassword.NewPassword ||
                                user.Pass3 != null && Decrypt(user.Pass3, true) == forgotPassword.NewPassword || user.Pass4 != null && Decrypt(user.Pass4, true) == forgotPassword.NewPassword || user.Pass5 != null && Decrypt(user.Pass5, true) == forgotPassword.NewPassword)
                            {
                                throw new Exception("Password should not be same as previous 5 passwords");
                            }
                            else
                            {
                                var index = user.LastChangedPassword;
                                var lastchangedIndex = 0;
                                var previousPWD = user.Password;

                                if (!string.IsNullOrEmpty(index))
                                {
                                    if (user.Pass1 != null && index.Contains("user.Pass1"))
                                    {
                                        lastchangedIndex = 2;
                                    }
                                    else if (user.Pass2 != null && index.Contains("user.Pass2"))
                                    {
                                        lastchangedIndex = 3;
                                    }
                                    else if (user.Pass3 != null && index.Contains("user.Pass3"))
                                    {
                                        lastchangedIndex = 4;
                                    }
                                    else if (user.Pass4 != null && index.Contains("user.Pass4"))
                                    {
                                        lastchangedIndex = 5;
                                    }
                                    else if (user.Pass5 != null && index.Contains("user.Pass5"))
                                    {
                                        lastchangedIndex = 1;
                                    }
                                }

                                if (lastchangedIndex <= 0)
                                {
                                    lastchangedIndex = 1;
                                }

                                if (lastchangedIndex == 1)
                                {
                                    user.Pass1 = previousPWD;
                                }
                                else if (lastchangedIndex == 2)
                                {
                                    user.Pass2 = previousPWD;
                                }
                                else if (lastchangedIndex == 3)
                                {
                                    user.Pass3 = previousPWD;
                                }
                                else if (lastchangedIndex == 4)
                                {
                                    user.Pass4 = previousPWD;
                                }
                                else if (lastchangedIndex == 5)
                                {
                                    user.Pass5 = previousPWD;
                                }

                                user.LastChangedPassword = lastchangedIndex.ToString();
                                user.Password = Encrypt(forgotPassword.NewPassword, true);
                                user.IsActive = true;
                                user.ModifiedOn = DateTime.Now;
                                user.ExpiryDate = DateTime.Now.AddDays(90);

                                await _dbContext.SaveChangesAsync();

                                history.UsedOn = DateTime.Now;
                                history.IsUsed = true;
                                history.Comment = "Token Used successfully";

                                await _dbContext.SaveChangesAsync();

                                tokenHistoryResult = history;

                                return tokenHistoryResult;
                            }
                        }
                        else
                        {
                            throw new Exception("Token Might have Already Used!");
                        }
                    }
                    else
                    {
                        throw new Exception("Requesting User Not Exist");
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorLog.WriteToFile("Master/ForgotPassword : - ", ex);
                throw new Exception(ex.Message ?? "Network error");
            }
            throw new Exception("Invalid Token");
        }

        #endregion

    }
}
