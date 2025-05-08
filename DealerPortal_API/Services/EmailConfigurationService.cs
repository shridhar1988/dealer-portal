using static DealerPortal_API.Models.DealerMaster;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Text;
using DealerPortal_API.Helpers;
using DealerPortal_API.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace DealerPortal_API.Services
{
    public class EmailConfigurationService
    {
        private readonly IConfiguration _configuration;
        private readonly DealerContext _dbContext;
        private readonly EmailService _emailService;
       // private readonly SMSService _smsService;

        public EmailConfigurationService(IConfiguration configuration, DealerContext dbContext, EmailService emailService)//, SMSService smsService)
        {
            _configuration = configuration;
            _dbContext = dbContext;
            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
           // _smsService = smsService ?? throw new ArgumentNullException(nameof(smsService));
        }

        public object GetMailConfiguration()
        {
            try
            {
                var EmailSetup = _dbContext.EmailConfiguration.FirstOrDefault(k => k.ID == 1);
                if (EmailSetup != null)
                {
                    var result = new EmailConfigurations()
                    {
                        ID = EmailSetup.ID,
                        MailID = EmailSetup.MailAddress,
                        MailPassword = EmailSetup.Password,
                        UserName=EmailSetup.UserName,
                        SmtpPort = EmailSetup.OutgoingPort,
                        SmtpServer = EmailSetup.ServerAddress
                    };
                    return result;
                }
                else
                {
                    //return NotFound("Email configuration not found");
                    throw new Exception("The user name or password is incorrect");
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network error");
            }
        }
        public void UpdateMailConfiguration(EmailConfigurations configuration)
        {
            try
            {
                var em = _dbContext.EmailConfiguration.FirstOrDefault(k => k.ID == configuration.ID);
                if (em != null)
                {
                    em.MailAddress = configuration.MailID;
                    em.Password = configuration.MailPassword;
                    em.ServerAddress = configuration.SmtpServer;
                    em.OutgoingPort = configuration.SmtpPort;

                    _dbContext.SaveChanges();
                }
                else
                {
                    throw new NotFiniteNumberException("Email configuration not found");
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network error");
            }
        }
        public MailBodyConfiguration GetMailBodyConfigurationByEmailType(string emailType)
        {
            try
            {
                var exist = _dbContext.MailBodyConfigurations.FirstOrDefault(m => m.MailType.ToLower() == emailType.ToLower());
                if (exist == null)
                {
                    throw new Exception($"No mail body configuration found.");
                }
                return exist;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task RequestOtp(string emailOrMobileNo)
        {
            try
            {
                User user = null;
                if (emailOrMobileNo.Contains('@') && emailOrMobileNo.Contains('.'))
                {
                    user = await _dbContext.Users.FirstOrDefaultAsync(tb => tb.Email == emailOrMobileNo);
                    if (user == null)
                    {
                        throw new Exception("Email ID not found");
                    }
                }
                else if (Regex.IsMatch(emailOrMobileNo, @"^\+?\d{10,12}$"))
                {
                    user = await _dbContext.Users.FirstOrDefaultAsync(tb => tb.ContactNumber == emailOrMobileNo);
                    if (user == null)
                    {
                        throw new Exception("Mobile number not found");
                    }
                }
                if (!Regex.IsMatch(emailOrMobileNo, @"^(.+)@(.+)$") && !Regex.IsMatch(emailOrMobileNo, @"^\d{10,12}$"))
                {
                    throw new Exception("Invalid input format");
                }

                // Find the user based on the provided username or email
                user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == emailOrMobileNo || u.ContactNumber == emailOrMobileNo);
                if (user == null)
                {
                    throw new Exception("User not found");
                }

                if (!user.IsActive)
                {
                    throw new Exception("User is not active");
                }
                if (emailOrMobileNo.Contains('@') && emailOrMobileNo.Contains('.'))
                {
                    // Send OTP via email
                    await _emailService.GenerateAndSendOTP(emailOrMobileNo);
                }
                else if (Regex.IsMatch(emailOrMobileNo, @"^\+?\d{10,12}$"))
                {
                    // Send OTP via SMS
                   // await _smsService.GenerateAndSendOTP(emailOrMobileNo);
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to request OTP", ex);
            }
        }

        public async Task<bool> VerifyOtp(string emailOrMobileNo, string otp)
        {
            try
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == emailOrMobileNo || u.ContactNumber == emailOrMobileNo);
                if (user == null)
                {
                    throw new Exception("User not found");
                }

                if (!user.IsActive)
                {
                    throw new Exception("User is not active");
                }

                var latestOtp = await _dbContext.PasswordResetOtpHistorys
                    .Where(pr => (pr.Email == emailOrMobileNo || pr.MobileNo == emailOrMobileNo) && pr.OTPIsActive)
                    .OrderByDescending(pr => pr.CreatedOn)
                    .FirstOrDefaultAsync();

                if (latestOtp == null || latestOtp.OTP != otp)
                {
                    throw new Exception("Invalid OTP");
                }

                // Check OTP expiry
                if (latestOtp.ExpiryOn < DateTime.Now)
                {
                    throw new Exception("OTP has expired. Please try with a new OTP");
                }

                // Deactivate the OTP in the PasswordResetotpHistry Table in the Database
                //latestOtp.OTPIsActive = false;
                //await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<string> ChangePasswordFormOtp(PasswordChangeRequest request)
        {
            try
            {
                User user = null;
                if (request.EmailorMobileNo.Contains('@') && request.EmailorMobileNo.Contains('.'))
                {
                    user = await _dbContext.Users.FirstOrDefaultAsync(tb => tb.Email == request.EmailorMobileNo);
                    if (user == null)
                    {
                        throw new Exception("Email ID not found");
                    }
                }
                else if (Regex.IsMatch(request.EmailorMobileNo, @"^\+?\d{10,12}$"))
                {
                    user = await _dbContext.Users.FirstOrDefaultAsync(tb => tb.ContactNumber == request.EmailorMobileNo);
                    if (user == null)
                    {
                        throw new Exception("Mobile number not found");
                    }
                }
                if (!Regex.IsMatch(request.EmailorMobileNo, @"^(.+)@(.+)$") && !Regex.IsMatch(request.EmailorMobileNo, @"^\d{10,12}$"))
                {
                    throw new Exception("Invalid input format");
                }

                // Find the user based on the provided username or email
                user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == request.EmailorMobileNo || u.ContactNumber == request.EmailorMobileNo);
                if (user == null)
                {
                    throw new Exception("User not found");
                }

                if (!user.IsActive)
                {
                    throw new Exception("User is not active");
                }

                // Find the latest active OTP for the user
                var latestOtp = await _dbContext.PasswordResetOtpHistorys
                    .Where(pr => (pr.Email == request.EmailorMobileNo || pr.MobileNo == request.EmailorMobileNo) && pr.OTPIsActive)
                    .OrderByDescending(pr => pr.CreatedOn)
                    .FirstOrDefaultAsync();

                if (latestOtp == null || latestOtp.OTP != request.Otp)
                {
                    throw new Exception("Invalid OTP");
                }

                if (latestOtp.ExpiryOn < DateTime.Now)
                {
                    throw new Exception("OTP has expired. Try with New OTP"); // OTP has expired
                }

                // Update the user's password with the new password
                user.Password = Encrypt(request.NewPassword, true);
                await _dbContext.SaveChangesAsync();

                // Deactivate the OTP
                latestOtp.OTPIsActive = false;
                await _dbContext.SaveChangesAsync();

                string messagedata = "Password changed successfull";

                return messagedata;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
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

        public IEnumerable<MailBodyConfiguration> GetAllMailBodyConfigurations()
        {
            try
            {
                return _dbContext.MailBodyConfigurations.ToList();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public MailBodyConfiguration GetMailBodyConfiguration(int id)
        {
            try
            {
                var exist = _dbContext.MailBodyConfigurations.FirstOrDefault(m => m.ID == id);
                if (exist == null)
                {
                    throw new Exception($"No mail body configuration found.");
                }
                return exist;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<MailBodyConfiguration> AddMailBodyConfiguration(MailBodyConfiguration mailBodyConfiguration)
        {
            try
            {
                _dbContext.MailBodyConfigurations.Add(mailBodyConfiguration);
                _dbContext.SaveChanges();

                return mailBodyConfiguration;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<MailBodyConfiguration> UpdateMailBodyConfiguration(MailBodyConfiguration mailBodyConfiguration)
        {
            try
            {
                var exist = _dbContext.MailBodyConfigurations.FirstOrDefault(m => m.ID == mailBodyConfiguration.ID);
                if (exist == null)
                {
                    throw new Exception($"No mail body configuration found.");
                }
                exist.MailType = mailBodyConfiguration.MailType;
                exist.MailBody = mailBodyConfiguration.MailBody;
                exist.MailSubject = mailBodyConfiguration.MailSubject;

                _dbContext.SaveChanges();

                return exist;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<MailBodyConfiguration> DeleteMailBodyConfiguration(int id)
        {
            try
            {
                var mailBodyConfiguration = _dbContext.MailBodyConfigurations.Find(id);
                if (mailBodyConfiguration == null)
                {
                    throw new KeyNotFoundException("Mail body configuration not found");
                }

                _dbContext.MailBodyConfigurations.Remove(mailBodyConfiguration);
                _dbContext.SaveChanges();

                return mailBodyConfiguration;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<List<ManagerUserMapData>> GetAllManagerUserMaps()
        {
            try
            {
                List<Guid> uniqueManagerIDs = await _dbContext.ManagerUserMaps
             .Select(map => map.ManagerID)
             .Distinct()
             .ToListAsync();

                List<ManagerUserMapData> managerUserMapDatas = new List<ManagerUserMapData>();

                foreach (var managerID in uniqueManagerIDs)
                {
                    var userIDs = await _dbContext.ManagerUserMaps
                        .Where(map => map.ManagerID == managerID)
                        .Select(map => map.UserID.ToString())
                        .ToListAsync();

                    string userIdString = string.Join(",", userIDs);

                    var managerUserMapData = new ManagerUserMapData
                    {
                        ManagerID = managerID,
                        UserID = userIdString
                    };
                    managerUserMapDatas.Add(managerUserMapData);
                }

                return managerUserMapDatas;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<ManagerUserMapData> GetManagerUserMapById(Guid managerId)
        {
            try
            {
                var existManager = await _dbContext.ManagerUserMaps.FirstOrDefaultAsync(map => map.ManagerID == managerId);
                if (existManager == null)
                {
                    throw new KeyNotFoundException($"Manager with ID {managerId} does not exist.");
                }

                var userIds = await _dbContext.ManagerUserMaps
                    .Where(map => map.ManagerID == managerId)
                    .Select(map => map.UserID.ToString())
                    .ToListAsync();

                string userIdString = string.Join(",", userIds);

                var managerUserMapData = new ManagerUserMapData
                {
                    ManagerID = existManager.ManagerID,
                    UserID = userIdString
                };

                return managerUserMapData;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<ManagerUserMapDTO> CreateManagerUserMap(ManagerUserMapDTO map)
        {
            try
            {
                if (map.ManagerID != Guid.Empty && !string.IsNullOrEmpty(map.UserID))
                {
                    string[] userIdArray = map.UserID.Split(',');

                    foreach (string userId in userIdArray)
                    {
                        if (Guid.TryParse(userId, out Guid parsedUserId))
                        {
                            ManagerUserMap mapdata = new ManagerUserMap
                            {
                                ManagerID = map.ManagerID,
                                UserID = parsedUserId,
                                CreatedBy = map.CreatedBy,
                                IsActive = true,
                                CreatedOn = DateTime.Now
                            };
                            _dbContext.ManagerUserMaps.Add(mapdata);
                        }
                        else
                        {
                            throw new ArgumentException($"Invalid UserID format: {userId}");
                        }
                    }
                    await _dbContext.SaveChangesAsync();
                }
                else
                {
                    throw new ArgumentException("ManagerID or UserID is invalid or empty.");
                }

                return map;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<ManagerUserMapDTO> UpdateManagerUserMap(ManagerUserMapDTO map)
        {
            try
            {
                var existingMaps = _dbContext.ManagerUserMaps
            .Where(map => map.ManagerID == map.ManagerID)
            .ToList();

                foreach (var existingMap in existingMaps)
                {
                    _dbContext.ManagerUserMaps.Remove(existingMap);
                }

                await _dbContext.SaveChangesAsync();

                // Create a new ManagerUserMap with the updated data
                if (!string.IsNullOrEmpty(map.UserID))
                {
                    string[] userIdArray = map.UserID.Split(',');

                    foreach (string userId in userIdArray)
                    {
                        if (Guid.TryParse(userId, out Guid parsedUserId))
                        {
                            ManagerUserMap newMap = new ManagerUserMap
                            {
                                ManagerID = map.ManagerID,
                                UserID = parsedUserId,
                                CreatedBy = map.CreatedBy,
                                IsActive = true,
                                CreatedOn = DateTime.Now
                            };
                            _dbContext.ManagerUserMaps.Add(newMap);
                        }
                        else
                        {
                            throw new ArgumentException($"Invalid UserID format: {userId}");
                        }
                    }

                    await _dbContext.SaveChangesAsync();
                }
                else
                {
                    throw new ArgumentException("UserID is empty.");
                }

                return map;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<List<ManagerUserMap>> DeleteManagerUserMap(Guid managerId)
        {
            try
            {
                var mapsToDelete = await _dbContext.ManagerUserMaps
            .Where(map => map.ManagerID == managerId)
            .ToListAsync();

                if (mapsToDelete.Count == 0)
                {
                    throw new KeyNotFoundException($"ManagerUserMap with ManagerID {managerId} not found!");
                }

                _dbContext.ManagerUserMaps.RemoveRange(mapsToDelete);
                await _dbContext.SaveChangesAsync();

                return mapsToDelete;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<List<ManagerUserMap>> GetManagerUserMapByManagerId(Guid managerId)
        {
            try
            {
                var managerUserMaps = await _dbContext.ManagerUserMaps
                    .Where(m => m.ManagerID == managerId)
                    .ToListAsync();
                return managerUserMaps;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Error retrieving ManagerUserMap by ManagerId");
            }
        }
    }
}
