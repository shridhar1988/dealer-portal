using System.Security.Cryptography;
using System.Text;
using DealerPortal_API.DbContexts;
using DealerPortal_API.Helpers;
using DealerPortal_API.Models;
using Microsoft.EntityFrameworkCore;
using static DealerPortal_API.Models.DealerMaster;

namespace DealerPortal_API.Services
{
    public interface IRetailerUserCreationServices
    {
        List<UserWithRole> GetAllRetailerUsers();
        Task<RetailerUsers> CreateUser(RetailerUsers userWithRole);
        Task<RetailerUsers> UpdateUser(RetailerUsers userWithRole);
        Task<RetailerUsers> DeleteUser(string ClientId, Guid UserID, string? loggedUserId);
    }
    public class RetailerUserCreationServices:IRetailerUserCreationServices
    {
        private readonly IConfiguration _configuration;
        private readonly DealerContext _dbContext;
        private readonly EmailService _emailService;
        public RetailerUserCreationServices(DealerContext dbContext, IConfiguration configuration, EmailService emailService)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            _emailService = emailService;
        }
      
        public async Task<RetailerUsers> CreateUser(RetailerUsers userWithRole)
        {
            var strategy = _dbContext.Database.CreateExecutionStrategy();
            return await strategy.ExecuteAsync(async () =>
            {
                using (var transaction = await _dbContext.Database.BeginTransactionAsync())
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
                        //if (userWithRole.ProfilePic != null)
                        //{
                        //    string folderPath = _configuration["FolderPath"];
                        //    string foldername = _configuration["FolderName"];
                        //    string portalAddresslink = _configuration["ApiURL"];
                        //    // Save new profile picture
                        //    var fileName = $"{Guid.NewGuid()}_{userWithRole.ProfilePic.FileName}";
                        //    filePath1 = Path.Combine(folderPath, fileName);
                        //    dbfilePath1 = portalAddresslink + Path.Combine(foldername, fileName);

                        //    using (var stream = new FileStream(filePath1, FileMode.Create))
                        //    {
                        //        await userWithRole.ProfilePic.CopyToAsync(stream);
                        //    }
                        //}

                        // Creating User
                        User user = new User
                        {
                            UserID = Guid.NewGuid(),
                            UserName = userWithRole.UserName,
                            Email = userWithRole.Email,
                            Password = Encrypt(userWithRole.Password, true),
                            ContactNumber = userWithRole.ContactNumber,
                            GSTNumber = userWithRole.GSTNumber,
                            PANNumber = userWithRole.PANNumber,
                            ClientId = userWithRole.ClientId,
                            CreatedBy = userWithRole.CreatedBy,
                            IsActive = true,
                            CreatedOn = System.DateTime.Now,
                            IsLocked = false,
                            Attempts = 0,
                            ExpiryDate = DateTime.Now.AddDays(90),
                            ProfilePath = filePath1,
                            PicDbPath = dbfilePath1
                        };
                        _dbContext.Users.Add(user);
                        await _dbContext.SaveChangesAsync();
                        Log.DataLog(user.UserID.ToString(), $"Retail user created with the mail {user.Email} ", "Retail User creation Log");
                        EmpInfo empinfo = new EmpInfo
                        {
                            EmpId = user.UserID,
                            FirstName = userWithRole.FirstName,
                            LastName = userWithRole.LastName,
                            Address = userWithRole.Address,
                            Email = userWithRole.Email,
                            Mobile = userWithRole.ContactNumber,
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
                        Log.DataLog(user.UserID.ToString(), $"For thew user id {user.UserID} role id {userWithRole.RoleID} Was added ", "User Creation Log");

                        RetailerUsers userResult = new RetailerUsers
                        {
                            UserName = user.UserName,
                            LastName = userWithRole.LastName,
                            FirstName = userWithRole.FirstName,
                            Email = user.Email,
                            ContactNumber = user.ContactNumber,
                            UserID = user.UserID,
                            Password = user.Password,
                            RoleID = userRole.RoleID,
                            GSTNumber = user.GSTNumber,
                            PANNumber = user.PANNumber,
                        };

                        // Send initialization email
                        var emailResult = await _emailService.SendInitializationMail(userResult.UserName, userResult.Email, Decrypt(userResult.Password, true), portalAddress);
                        //if (!emailResult)
                        //{
                        //    throw new Exception("Failed to send email");
                        //}
                        await _dbContext.SaveChangesAsync();
                        await transaction.CommitAsync();
                        return userResult;
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        // Handle exceptions here or let them bubble up
                        throw new Exception(ex.Message ?? "Network Error");
                    }
                }
            });
        }
        public async Task<RetailerUsers> UpdateUser(RetailerUsers userWithRole)
        {

            try
            {
                var clientcheck = _dbContext.Clients.FirstOrDefault(e => e.Id == userWithRole.ClientId);
                if (clientcheck == null)
                {
                    throw new Exception("ClientId is Not exists");
                }

                RetailerUsers userResult = new RetailerUsers();

                var user1 = await _dbContext.Users.FirstOrDefaultAsync(tb1 => tb1.UserName == userWithRole.UserName && tb1.IsActive && tb1.UserID != userWithRole.UserID);

                if (user1 == null)
                {
                    var user2 = await _dbContext.Users.FirstOrDefaultAsync(tb1 => tb1.Email == userWithRole.Email && tb1.IsActive && tb1.UserID != userWithRole.UserID);

                    if (user2 == null)
                    {
                        var user = await _dbContext.Users.FirstOrDefaultAsync(tb =>  tb.UserID == userWithRole.UserID && tb.ClientId == userWithRole.ClientId);
                        if (user != null)
                        {
                            //user.UserName = userWithRole.UserName;
                            //user.Email = userWithRole.Email;
                            //user.Password = Encrypt(userWithRole.Password, true);
                            //user.ContactNumber = userWithRole.ContactNumber;
                            //user.ClientId = userWithRole.ClientId;
                            //user.GSTNumber = userWithRole.GSTNumber;
                            //user.PANNumber = userWithRole.PANNumber;
                            //user.IsActive = userWithRole.IsActive;

                            List<string> updatedFields = new List<string>();

                            void UpdateField<T>(string fieldName, T existingValue, T newValue, Action<T> updateAction)
                            {
                                if (!EqualityComparer<T>.Default.Equals(existingValue, newValue))
                                {
                                    updateAction(newValue);
                                    updatedFields.Add($"{fieldName}: Existing Data : \"{existingValue}\" Updated to \"{newValue}\"");
                                }
                            }

                            UpdateField("UserName", user.UserName, userWithRole.UserName, val => user.UserName = val);
                            UpdateField("Email", user.Email, userWithRole.Email, val => user.Email = val);
                            string encryptedPassword = Encrypt(userWithRole.Password, true);
                            UpdateField("Password", user.Password, encryptedPassword, val => user.Password = val);
                            UpdateField("ContactNumber", user.ContactNumber, userWithRole.ContactNumber, val => user.ContactNumber = val);
                            UpdateField("ClientId", user.ClientId, userWithRole.ClientId, val => user.ClientId = val);
                            UpdateField("GSTNumber", user.GSTNumber, userWithRole.GSTNumber, val => user.GSTNumber = val);
                            UpdateField("PANNumber", user.PANNumber, userWithRole.PANNumber, val => user.PANNumber = val);
                            UpdateField("IsActive", user.IsActive, userWithRole.IsActive, val => user.IsActive = val);
                      
                            user.ModifiedOn = DateTime.Now;
                            user.ModifiedBy = userWithRole.ModifiedBy;
                     

                            //if (userWithRole.ProfilePic != null)
                            //{

                            //    if (user.ProfilePath != null)
                            //    {
                            //        var filePath = user.ProfilePath;
                            //        if (File.Exists(filePath))
                            //        {
                            //            File.Delete(filePath);
                            //        }
                            //    }
                            //    string NewfilePath1 = null;
                            //    string NewdbfilePath1 = null;
                            //    if (userWithRole.ProfilePic != null)
                            //    {
                            //        string folderPath = _configuration["FolderPath"];
                            //        string foldername = _configuration["FolderName"];
                            //        string portalAddresslink = _configuration["ApiURL"];
                            //        // Save new profile picture
                            //        var fileName = $"{Guid.NewGuid()}_{userWithRole.ProfilePic.FileName}";
                            //        NewfilePath1 = Path.Combine(folderPath, fileName);
                            //        NewdbfilePath1 = portalAddresslink + Path.Combine(foldername, fileName);

                            //        using (var stream = new FileStream(NewfilePath1, FileMode.Create))
                            //        {
                            //            await userWithRole.ProfilePic.CopyToAsync(stream);
                            //        }
                            //    }
                            //    user.ProfilePath = NewfilePath1;
                            //    user.PicDbPath = NewdbfilePath1;
                            //}


                            await _dbContext.SaveChangesAsync();

                            //update Empinfo
                            EmpInfo empinfo = _dbContext.EmpInfos.FirstOrDefault(x => x.EmpId == userWithRole.UserID);
                            if (empinfo != null)
                            {
                                empinfo.Address = userWithRole.Address;
                                empinfo.FirstName = userWithRole.FirstName;
                                empinfo.LastName = userWithRole.LastName;
                                empinfo.Email = userWithRole.Email;
                                empinfo.Mobile = userWithRole.ContactNumber;
                              
                                empinfo.IsActive = userWithRole.IsActive;
                                UpdateField("Address", empinfo.Address, userWithRole.Address, val => empinfo.Address = val);
            
                                UpdateField("FirstName", empinfo.FirstName, userWithRole.FirstName, val => empinfo.FirstName = val);
                                UpdateField("LastName", empinfo.LastName, userWithRole.LastName, val => empinfo.LastName = val);
                                UpdateField("Email", empinfo.Email, userWithRole.Email, val => empinfo.Email = val);
                
                                UpdateField("Mobile", empinfo.Mobile, userWithRole.ContactNumber, val => empinfo.Mobile = val);                        
                             
                                UpdateField("IsActive", empinfo.IsActive, userWithRole.IsActive, val => empinfo.IsActive = val);
                                empinfo.ModifiedBy = userWithRole.ModifiedBy;
                                empinfo.ModifiedOn = userWithRole.ModifiedOn;
                            }
                            await _dbContext.SaveChangesAsync();
                            if (updatedFields.Any())
                            {
                                Log.DataLog($"{userWithRole.ModifiedBy}", $"Retail User Id {user.UserID} updated fields: {string.Join(", ", updatedFields)} By the userId :{userWithRole.ModifiedBy}", "Retail User Update Log");
                            }
                            userResult.UserName = user.UserName;
                            userResult.Email = user.Email;
                            userResult.ContactNumber = user.ContactNumber;
                            userResult.UserID = user.UserID;
                            userResult.Password = user.Password;
                            userResult.GSTNumber = user.GSTNumber;
                            userResult.PANNumber = user.PANNumber;

                            // Update User's role
                            //UserRoleMap oldUserRole = _dbContext.UserRoleMaps.FirstOrDefault(x => x.UserID == userWithRole.UserID && x.IsActive);
                            //if (oldUserRole != null && oldUserRole.RoleID != userWithRole.RoleID)
                            //{
                            //    _dbContext.UserRoleMaps.Remove(oldUserRole);
                            //    await _dbContext.SaveChangesAsync();

                            //    UserRoleMap userRole = new UserRoleMap()
                            //    {
                            //        RoleID = userWithRole.RoleID,
                            //        UserID = user.UserID,
                            //        IsActive = true,
                            //        CreatedBy = userWithRole.ModifiedBy,
                            //        CreatedOn = DateTime.Now,
                            //    };
                            //    _dbContext.UserRoleMaps.Add(userRole);
                            //    await _dbContext.SaveChangesAsync();

                            //    userResult.UserName = user.UserName;
                            //    userResult.Email = user.Email;
                            //    userResult.ContactNumber = user.ContactNumber;
                            //    userResult.UserID = user.UserID;
                            //    userResult.Password = user.Password;
                            //    userResult.RoleID = userRole.RoleID;
                            //}
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
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<RetailerUsers> DeleteUser(string ClientId, Guid UserID, string? loggedUserId)
        {
            try
            {
                var clientcheck = _dbContext.Clients.FirstOrDefault(e => e.Id == ClientId);
                if (clientcheck == null)
                {
                    throw new Exception("ClientId is Not exists");
                }

                RetailerUsers userResult = new RetailerUsers();
                var user = await _dbContext.Users.FirstOrDefaultAsync(tb => tb.IsActive && tb.UserID == UserID && tb.ClientId == ClientId);
                if (user != null)
                {
                    _dbContext.Users.Remove(user);
                    await _dbContext.SaveChangesAsync();

                    var emp = await _dbContext.EmpInfos.FirstOrDefaultAsync(tb => tb.IsActive && tb.EmpId == UserID);
                    if (user != null)
                    {
                        _dbContext.EmpInfos.Remove(emp);
                        await _dbContext.SaveChangesAsync();
                    }

                    // Delete User's role
                    UserRoleMap userRole = _dbContext.UserRoleMaps.FirstOrDefault(x => x.UserID == UserID && x.IsActive);
                    if (userRole != null)
                    {
                        _dbContext.UserRoleMaps.Remove(userRole);
                        await _dbContext.SaveChangesAsync();
                    }
                    Log.DataLog(loggedUserId.ToString(), $"Retail user id {UserID} data deleted successfully by the Userid : {loggedUserId}", "Retailer User Delete Log");

                    userResult.UserName = user.UserName;
                    userResult.Email = user.Email;
                    userResult.ContactNumber = user.ContactNumber;
                    userResult.UserID = user.UserID;
                    userResult.Password = user.Password;
                    userResult.RoleID = userRole.RoleID;
                    userResult.PANNumber=user.PANNumber;
                    userResult.GSTNumber = user.GSTNumber;
                }
                //WriteLog.WriteToFile($"Retailer Deleted Successfully - UserId-{user.UserID} ");
                return userResult;
            }
            catch (Exception ex)
            {
                // Handle exceptions here or let them bubble up
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public List<UserWithRole> GetAllRetailerUsers()
        {
            try
            {
                var result = (from tb in _dbContext.Users
                              join tb1 in _dbContext.UserRoleMaps on tb.UserID equals tb1.UserID
                              join tb2 in _dbContext.Roles on tb1.RoleID equals tb2.RoleID
                              join tb3 in _dbContext.EmpInfos on tb.UserID equals tb3.EmpId
                              where tb2.IsActive && tb2.RoleName.ToLower() == "Retailer"
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
                                  tb.GSTNumber,
                                  tb.PANNumber,
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
                    AccountGroup = record.PANNumber,
                    ClientId = record.GSTNumber,
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
                throw new Exception(ex.Message ?? "Network Error");
            }
        }


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
    }
}
