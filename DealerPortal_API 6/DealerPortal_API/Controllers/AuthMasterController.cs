using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static DealerPortal_API.Models.DealerMaster;
using DealerPortal_API.Helpers;
using DealerPortal_API.DbContexts;
using DealerPortal_API.Services;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http.HttpResults;

namespace DealerPortal_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthMasterController : ControllerBase
    {
        private readonly DealerContext _dbContext;
        private readonly IConfiguration _configuration;
        private readonly AuthMasterSerices _authMasterService;
        private readonly int _tokenTimespan;

        public AuthMasterController(DealerContext dbContext, IConfiguration configuration, AuthMasterSerices authMasterService)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            _authMasterService = authMasterService;
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

        [HttpGet("FindClient")]
        public IActionResult FindClient(string clientId)
        {
            try
            {
                var client = _authMasterService.FindClient(clientId);
                if (client != null)
                {
                    //return Ok(client);
                    return Ok(new { success = "success", message = "You have successfully get data", data = client });
                }
                else
                {
                    //return NotFound();
                    return Ok(new { success = "error", message = "Data Not Found" });
                }
            }
            catch (Exception ex)
            {
                //return StatusCode(500, "An error occurred while finding the client.");
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        [HttpGet("AuthenticateUser")]
        public async Task<IActionResult> AuthenticateUser(string UserName, string Password)
        {
            try
            {
                var authenticationResult = await _authMasterService.AuthenticateUser(UserName, Password);
                if (authenticationResult != null)
                {
                    if (authenticationResult.IsSuccess)
                    {
                        //return Ok(authenticationResult);
                        return Ok(new { success = "success", message = "You have successfully get data", data = authenticationResult });
                    }
                    else
                    {
                        //return BadRequest(authenticationResult.Message);

                        return Ok(new { success = "error", message = authenticationResult.Message });
                    }
                }
                else
                {
                    //return StatusCode(500, "An error occurred while authenticating the user.");
                    return Ok(new { success = "error", message = "An error occurred while authenticating the user" });
                }
            }
            catch (Exception ex)
            {
                ErrorLog.WriteToFile("Master/AuthenticateUser : - ", ex);
                //return StatusCode(500, "An error occurred while authenticating the user.");
                return Ok(new { success = "error", message = ex.Message });
            }
        }


        #endregion

        #region UserControll

        [HttpGet("GetAllUsers")]
        public IActionResult GetAllUsers(string ClientId)
        {
            try
            {
                var users = _authMasterService.GetAllUsers(ClientId);
                //return Ok(users);
                return Ok(new { success = "success", message = "You have successfully get user data", data = users });

            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        [HttpGet("GetUserDataById")]
        public IActionResult GetUserDataById(string ClientId ,string UserId)
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
                              where tb1.IsActive && tb.ClientId == ClientId && tb.UserID.ToString() == UserId
                              orderby tb.CreatedOn descending
                              select new
                              {
                                  tb.UserID,
                                  tb.Email,
                                  tb.UserName,
                              
                                  
                                  tb.FirstName,
                                  tb.LastName,
                                  tb.ContactNumber,
                                  Password = Decrypt(tb.Password, true),
                                  tb1.RoleID,
                                  tb.Company,tb.Plant,tb3.DateOfBirth,tb3.Address,

                                  tb.IsActive,
                                  tb.CreatedOn,
                                  tb.ModifiedOn,
                               
                                  tb2.RoleName,
                                  tb.AccountGroup,
                                  tb.ClientId,
                             
                                  tb3.JoiningDate,
                                  tb.ProfilePath,tb.PicDbPath
                             
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
                    JoiningDate = record.JoiningDate,
                    Company=record.Company,Plant=record.Plant
                }).ToList();

                return Ok(new { success = "success", message = "You have successfully get user data", data = result });
            }
            catch (Exception ex)
            {
                // Handle exceptions here or let them bubble up
                //throw new Exception(ex.Message ?? "Network Error");
                return Ok(new { success = "error", message = "error fetching user data " });
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

        [HttpGet("GetAdminUsers")]
        public IActionResult GetAdminUsers(string ClientId)
        {
            try
            {
                var adminUsers = _authMasterService.GetAdminUsers(ClientId);
                //return Ok(adminUsers);
                return Ok(new { success = "success", message = "You have successfully get user data", data = adminUsers });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        [HttpGet("GetAllManagerUsers")]
        public IActionResult GetAllManagerUsers(string ClientId)
        {
            try
            {
                var managerUsers = _authMasterService.GetAllManagerUsers(ClientId);
                //return Ok(adminUsers);
                return Ok(new { success = "success", message = "You have successfully get user data", data = managerUsers });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }


        [HttpGet("GetAllEmpUsers")]
        public IActionResult GetAllEmpUsers(string ClientId)
        {
            try
            {
                var empUsers = _authMasterService.GetAllEmpUsers(ClientId);
                //return Ok(adminUsers);
                return Ok(new { success = "success", message = "You have successfully get user data", data = empUsers });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }
        [HttpGet("GetAllEmpInfo")]
        public async Task<IActionResult> GetAllEmpInfo()
        {
            try
            {
                var empInfoList = await _authMasterService.GetAllEmpInfo();
                return Ok(new { success = true, message = "You have successfully retrieved user data", data = empInfoList });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }


        [HttpGet("GetEmpInfoByEmpId")]
        public async Task<IActionResult> GetEmpInfoByEmpId(Guid id)
        {
            try
            {
                var empInfo = await _authMasterService.GetEmpInfoById(id);
                if (empInfo == null)
                    return NotFound();

                return Ok(new { success = true, message = "Data Fetched successfully", data = empInfo });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("CreateUser")]
        public async Task<IActionResult> CreateUser(UserWithRole userWithRole)
        {
            try
            {
                var userResult = await _authMasterService.CreateUser(userWithRole);
                //return Ok(userResult);
                return Ok(new { success = "success", message = "You have successfully get user data", data = userResult });
            }
            catch (Exception ex)
            {
                // Log the exception if needed
                //return StatusCode(500, "An error occurred while creating the user.");
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        [HttpPost("ProfileUpdateUser")]
        public async Task<ActionResult> ProfileUpdateUser([FromForm] UserProfileUpdate userProfileUpdate)
        {
            try
            {
                var userResult = await _authMasterService.ProfileUpdateUser(userProfileUpdate);
                return Ok(new { success = "success", message = "Profile image updated successfully...", data = userResult });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        [HttpPut("UpdateFromEmployeeEmpInfo")]
        public async Task<IActionResult> UpdateFromEmployeeEmpInfo(FromEmployeeEmpInfo empInfo)
        {
            try
            {
                var userResult = await _authMasterService.UpdateFromEmployeeEmpInfo(empInfo);
                return Ok(new { success = true, message = "Employee information updated successfully", data = userResult });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPost("UpdateUser")]
        public async Task<ActionResult<UserWithRole>> UpdateUser(UserWithRole userWithRole)
        {
            try
            {
                var userResult = await _authMasterService.UpdateUser(userWithRole);
                //return Ok(userResult);
                return Ok(new { success = "success", message = "You have successfully get user data", data = userResult });
            }
            catch (Exception ex)
            {
                // Log the exception if needed
                //return BadRequest(ex.Message ?? "An error occurred while updating the user.");
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        [HttpPost("DeleteUser")]
        public async Task<ActionResult<UserWithRole>> DeleteUser(string ClientId, Guid UserID,string? loggedUserId)
        {
            try
            {
                var userResult = await _authMasterService.DeleteUser(ClientId, UserID,loggedUserId);
                //return Ok(userResult);
                return Ok(new { success = "success", message = "You have successfully get user data", data = userResult });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }


        #endregion

        #region RoleControll

        [HttpGet("GetAllRoles")]
        public IActionResult GetAllRoles(string ClientId)
        {
            try
            {
                var roles = _authMasterService.GetAllRoles(ClientId);
                return Ok(new { success = "success", message = "You have successfully getthe  Data", data = roles });
            }
            catch (Exception ex)
            {
                // Log the exception if needed
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        [HttpGet("GetAllRolesWithApp")]
        public IActionResult GetAllRolesWithApp(string ClientId)
        {
            try
            {
                var rolesWithApp = _authMasterService.GetAllRolesWithApp(ClientId);
                return Ok(new { success = "success", message = "You have successfully get the Data", data = rolesWithApp });
            }
            catch (Exception ex)
            {
                // Log the exception if needed
                return Ok(new { success = "error", message = ex.Message });
            }
        }


        [HttpPost("CreateRole")]
        public async Task<IActionResult> CreateRole(RoleWithApp roleWithApp)
        {
            try
            {
                var createdRole = await _authMasterService.CreateRole(roleWithApp);
                return Ok(new { success = "success", message = "You have successfully Created Data", data = createdRole });
            }
            catch (Exception ex)
            {
                // Log the exception if needed
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        [HttpPost("UpdateRole")]
        public async Task<IActionResult> UpdateRole(RoleWithApp roleWithApp)
        {
            try
            {
                var updatedRole = await _authMasterService.UpdateRole(roleWithApp);
                return Ok(new { success = "success", message = "You have successfully Update Data", data = updatedRole });
            }
            catch (Exception ex)
            {
                // Log the exception if needed
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        [HttpPost("DeleteRole")]
        public async Task<IActionResult> DeleteRole(Guid roleId)
        {
            try
            {
                var result = await _authMasterService.DeleteRole(roleId);
                return Ok(new { success = "success", message = "You have successfully Deleted Data", data = result });
            }
            catch (Exception ex)
            {
                // Log the exception if needed
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        #endregion

        #region AppControll


        [HttpGet("GetAllApps")]
        public IActionResult GetAllApps()
        {
            try
            {
                var apps = _authMasterService.GetAllApps();
                return Ok(new { success = "success", message = "You have successfully Update Data", data = apps });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        [HttpPost("CreateApp")]
        public async Task<IActionResult> CreateApp(App app)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    throw new ArgumentException("Model state is not valid");
                }

                var createdApp = await _authMasterService.CreateApp(app);
                return Ok(new { success = "success", message = "You have successfully Created Data", data = createdApp });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        [HttpPut("UpdateApp")]
        public async Task<IActionResult> UpdateApp(App app)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    throw new ArgumentException("Model state is not valid");
                }

                var updatedApp = await _authMasterService.UpdateApp(app);
                return Ok(new { success = "success", message = "You have successfully Update Data", data = updatedApp });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        [HttpDelete("DeleteApp")]
        public async Task<IActionResult> DeleteApp(Appdto app)
        {
            try
            {
                var deletedApp = await _authMasterService.DeleteApp(app);
                return Ok(new { success = "success", message = "You have successfully Deleted App", data = deletedApp });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }


        #endregion

        #region LoginHistoryControll


        [HttpPost("LoginHistory")]
        public async Task<IActionResult> LoginHistory(Guid userID, string username)
        {
            try
            {
                var loginData = await _authMasterService.AddLoginHistory(userID, username);
                //return Ok(loginData);
                return Ok(new { success = "success", message = "You have successfully get user data", data = loginData });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        [HttpGet("GetAllUsersLoginHistory")]
        public IActionResult GetAllUsersLoginHistory()
        {
            try
            {
                var userLoginHistoryList = _authMasterService.GetAllUsersLoginHistory();
                //return Ok(userLoginHistoryList);
                return Ok(new { success = "success", message = "You have successfully get user data", data = userLoginHistoryList });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        [HttpGet("GetCurrentUserLoginHistory")]
        public IActionResult GetCurrentUserLoginHistory(Guid userID)
        {
            try
            {
                var userLoginHistoryList = _authMasterService.GetCurrentUserLoginHistory(userID);
                //return Ok(userLoginHistoryList);
                return Ok(new { success = "success", message = "You have successfully get user data", data = userLoginHistoryList });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        [HttpPost("SignOut")]
        public async Task<IActionResult> SignOut(Guid userID)
        {
            try
            {
                var result = await _authMasterService.SignOut(userID);
                //return Ok(result);
                return Ok(new { success = "success", message = "You have successfully get user data", data = result });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }


        #endregion

        #region ChangePasswordControl

        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromForm] ChangePassword changePassword)
        {
            try
            {
                var result = await _authMasterService.ChangePassword(changePassword);
                //return Ok(result);
                return Ok(new { success = "success", message = "You have successfully Reseted the Password", data = result });

            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        [HttpPost("SendResetLinkToMail")]
        public async Task<ActionResult<AuthTokenHistory>> SendResetLinkToMail(EmailModel emailModel)
        {
            try
            {
                var result = await _authMasterService.SendResetLinkToMail(emailModel);
                //return Ok(result);
                return Ok(new { success = "success", message = "Password reset link has been sent successfully", data = result });

            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }


        [HttpPost("ForgotPassword")]
        public async Task<ActionResult> ForgotPassword(ForgotPassword forgotPassword)
        {
            try
            {
                var result = await _authMasterService.ForgotPassword(forgotPassword);
                //return Ok();
                return Ok(new { success = "success", message = "You have successfully Reseted password", data = result });

            }
            catch (Exception ex)
            {
                ErrorLog.WriteToFile("Master/ForgotPassword : - ", ex);
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        #endregion

    }
}
