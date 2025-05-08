using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using DealerPortal_API.DbContexts;
using DealerPortal_API.Helpers;
using DealerPortal_API.Models;
using DealerPortal_API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static DealerPortal_API.Models.DealerMaster;

namespace DealerPortal_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailConfigure : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly DealerContext _dbContext;
        private readonly EmailService _emailService;
        private readonly EmailConfigurationService _emailConfigurationService;

        public EmailConfigure(IConfiguration configuration, DealerContext dbContext, EmailService emailService, EmailConfigurationService emailConfigurationService)
        {
            _configuration = configuration;
            _dbContext = dbContext;
            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
            _emailConfigurationService = emailConfigurationService;
        }

        [HttpGet("GetMailConfiguration")]
        public IActionResult GetMailConfiguration()
        {
            try
            {
                var emailSetup = _emailConfigurationService.GetMailConfiguration();
                if (emailSetup != null)
                {
                    //return Ok(result);
                    return Json(new { success = "success", message = "You have successfully get user data", data = emailSetup });
                }
                else
                {
                    //return NotFound("Email configuration not found");
                    return Json(new { success = "success", message = "Email configuration not found" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = "error", message = ex.Message });
            }
        }

        [HttpPost("UpdateMailConfiguration")]
        public IActionResult UpdateMailConfiguration(EmailConfigurations configuration)
        {
            try
            {
                _emailConfigurationService.UpdateMailConfiguration(configuration);
                //return Ok("Email configuration updated successfully");
                return Json(new { success = "success", message = "Email configuration updated successfully" });
            }
            catch (NotFiniteNumberException ex)
            {
                //return NotFound(ex.Message);

                return Json(new { success = "error", message = ex.Message });
            }
            catch (Exception ex)
            {
                return Json(new { success = "error", message = ex.Message });
            }
        }

        [HttpPost("RequestOtp")]
        public async Task<IActionResult> RequestOtp(string emailOrMobileNo)
        {
            try
            {
                var result = _emailConfigurationService.RequestOtp(emailOrMobileNo);
                //return Ok("OTP Sent successfully");
                return Json(new { success = "success", message = "OTP Send successfully", data = result });
            }
            catch (Exception ex)
            {
                return Json(new { success = "error", message = ex.Message });
            }
        }

        [HttpPost("VerifyOtp")]
        public async Task<IActionResult> VerifyOtp(string emailOrMobileNo, string otp)
        {
            try
            {
                var result = await _emailConfigurationService.VerifyOtp(emailOrMobileNo, otp);
                //return Ok("OTP verified successfully");
                return Json(new { success = "success", message = "OTP verified successfully", data = result });
            }
            catch (Exception ex)
            {
                return Json(new { success = "error", message = ex.Message });
            }
        }


        [HttpPost("ChangePasswordFormOtp")]
        public async Task<IActionResult> ChangePasswordFormOtp(PasswordChangeRequest request)
        {
            try
            {
                var result = await _emailConfigurationService.ChangePasswordFormOtp(request);
                return Json(new { success = "success", message = "Password Changed successfully", data = result });
            }
            catch (Exception ex)
            {
                return Json(new { success = "error", message = ex.Message });
            }
        }

        [HttpGet("GetAllMailBodyConfigurations")]
        public IActionResult GetAllMailBodyConfigurations()
        {
            try
            {
                var emailbody = _emailConfigurationService.GetAllMailBodyConfigurations();
                return Json(new { success = "success", message = "You have successfully get Data", data = emailbody });
            }
            catch (Exception ex)
            {
                return Json(new { success = "error", message = ex.Message });
            }
        }


        [HttpGet("GetMailBodyConfiguration")]
        public IActionResult GetMailBodyConfiguration(int id)
        {
            try
            {
                var emailbody = _emailConfigurationService.GetMailBodyConfiguration(id);
                return Json(new { success = "success", message = "You have successfully get Data", data = emailbody });
            }
            catch (Exception ex)
            {
                return Json(new { success = "error", message = ex.Message });
            }
        }

        [HttpGet("GetMailBodyConfigurationByEmailType")]
        public IActionResult GetMailBodyConfigurationByEmailType(string emailType)
        {
            try
            {
                var emailbody = _emailConfigurationService.GetMailBodyConfigurationByEmailType(emailType);
                return Json(new { success = "success", message = "You have successfully get Data", data = emailbody });
            }
            catch (Exception ex)
            {
                return Json(new { success = "error", message = ex.Message });
            }
        }

        [HttpPost("AddMailBodyConfiguration")]
        public async Task<IActionResult> AddMailBodyConfiguration(MailBodyConfiguration mailbody)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    throw new ArgumentException("Model state is not valid");
                }

                var createdmailbody = await _emailConfigurationService.AddMailBodyConfiguration(mailbody);
                return Json(new { success = "success", message = "You have successfully Created EmailConfigBody", data = createdmailbody });
            }
            catch (Exception ex)
            {
                return Json(new { success = "error", message = ex.Message });
            }
        }

        [HttpPost("UpdateMailBodyConfiguration")]
        public async Task<IActionResult> UpdateMailBodyConfiguration(MailBodyConfiguration mailbody)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    throw new ArgumentException("Model state is not valid");
                }

                var updatedEmialBody = await _emailConfigurationService.UpdateMailBodyConfiguration(mailbody);
                return Json(new { success = "success", message = "You have successfully Update EmailConfigBody", data = updatedEmialBody });
            }
            catch (Exception ex)
            {
                return Json(new { success = "error", message = ex.Message });
            }
        }

        [HttpPost("DeleteMailBodyConfiguration")]
        public async Task<IActionResult> DeleteMailBodyConfiguration(int id)
        {
            try
            {
                var deletedApp = await _emailConfigurationService.DeleteMailBodyConfiguration(id);
                return Json(new { success = "success", message = "You have successfully Deleted EmailConfigBody", data = deletedApp });
            }
            catch (Exception ex)
            {
                return Json(new { success = "error", message = ex.Message });
            }
        }

    }

}