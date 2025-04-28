using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Ticketing_API.DbContexts;
using Ticketing_API.Services;
using Ticketing_API.Models;

using Microsoft.EntityFrameworkCore;
using static Ticketing_API.Models.AuthMaster;
using Ticketing_API.Helpers;
using DealerPortal_API.Services;

namespace Ticketing_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DealerPortalContext _dbContext;
        private readonly AuthService _authService;

        public AuthController(IConfiguration configuration, DealerPortalContext dbContext, AuthService authService)
        {
            _configuration = configuration;
            _authService = authService;
        }


        [HttpPost("Login")]
        public async Task<IActionResult> GetToken(LoginModel loginModel)
        {
            ErrorLog.WriteToFile("Auth/GetToken:- Get Token Called");
            try
            {
                var authenticationResult = await _authService.LoginUser(loginModel.UserName, loginModel.Password);
                if (authenticationResult != null)
                {
                    IConfiguration JWTSecurityConfig = _configuration.GetSection("Jwt");
                    string securityKey = JWTSecurityConfig.GetValue<string>("Key");
                    string issuer = JWTSecurityConfig.GetValue<string>("Issuer");
                    string audience = JWTSecurityConfig.GetValue<string>("Audience");

                    // Symmetric security key
                    var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityKey));
                    // Signing credentials
                    var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256Signature);

                    // Add claims
                    var claims = new List<Claim>();
                    claims.Add(new Claim(ClaimTypes.Name, authenticationResult.UserName));
                    claims.Add(new Claim(ClaimTypes.Role, authenticationResult.UserRole));

                    // Create token
                    var token = new JwtSecurityToken(
                            issuer: issuer,
                            audience: audience,
                            expires: DateTime.Now.AddMinutes(24),
                            signingCredentials: signingCredentials,
                            claims: claims
                        );

                    // Return token
                    authenticationResult.Token = new JwtSecurityTokenHandler().WriteToken(token);
                    Log.DataLog(authenticationResult.UserID, $"User Id {authenticationResult.UserID} Logged in Successfully", "LoginLog");
                    //return authenticationResult;
                    return Ok(new { success = "success", message = "You have successfully logged in", data = authenticationResult });
                }
                else
                {
                    //return Json(new { success = "error", message = "The user name or password is incorrect" });
                    throw new Exception("The user name or password is incorrect");
                }
            }
            catch (Exception ex)
            {
                ErrorLog.WriteToFile("Auth/GetToken", ex);
                string error = ex.Message;
                //throw new Exception(error);
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        [HttpPost("GetUserDetailes")]
        public async Task<IActionResult> GetUserDetailes(ClientIdModel clientIdModel)
        {
            ErrorLog.WriteToFile("Auth/GetToken:- Get Token Called");
            try
            {
                Client client = _authService.FindClient(clientIdModel.clientId);
                if (client != null)
                {
                    var authenticationResult = await _authService.AuthenticateUser(clientIdModel.clientId, clientIdModel.UserId);
                    if (authenticationResult != null)
                    {
                        //return authenticationResult;
                        return Ok(new { success = "success", message = "You have successfully data", data = authenticationResult });
                    }
                    else
                    {
                        //return Json(new { success = "error", message = "The user name or password is incorrect" });
                        throw new Exception("The user name not Found");
                    }
                }
                else
                {
                    //return Json(new { success = "error", message = "Invalid client id" });
                    throw new Exception("Invalid client id");
                }
            }
            catch (Exception ex)
            {
                ErrorLog.WriteToFile("Auth/GetToken", ex);
                string error = ex.Message;
                //throw new Exception(error);
                return Ok(new { success = "error", message = ex.Message });
            }
        }

    }

}
