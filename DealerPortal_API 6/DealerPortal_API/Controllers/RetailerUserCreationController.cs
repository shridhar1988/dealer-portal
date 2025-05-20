using DealerPortal_API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static DealerPortal_API.Models.DealerMaster;

namespace DealerPortal_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RetailerUserCreationController : ControllerBase
    {
        private readonly IRetailerUserCreationServices _retailerUserCreationServices;
        public RetailerUserCreationController(IRetailerUserCreationServices retailerUserCreationServices)
        {
            _retailerUserCreationServices = retailerUserCreationServices;
        }

        [HttpGet("GetAllRetailerUsers")]
        public IActionResult GetAllRetailerUsers()
        {
            try
            {
                var managerUsers = _retailerUserCreationServices.GetAllRetailerUsers();
                return Ok(new { success = "success", message = "You have successfully get user data", data = managerUsers });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        [HttpPost("CreateRetailer")]
        public async Task<IActionResult> CreateRetailer(RetailerUsers userWithRole)
        {
            try
            {
                var userResult = await _retailerUserCreationServices.CreateUser(userWithRole);
                return Ok(new { success = "success", message = "You have successfully created user", data = userResult });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        [HttpPost("UpdateRetailer")]
        public async Task<ActionResult<RetailerUsers>> UpdateRetailer(RetailerUsers userWithRole)
        {
            try
            {
                var userResult = await _retailerUserCreationServices.UpdateUser(userWithRole);
                return Ok(new { success = "success", message = "You have successfully updated user data", data = userResult });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        [HttpPost("DeleteUser")]
        public async Task<ActionResult<RetailerUsers>> DeleteUser(string ClientId, Guid UserID, string? loggedUserId)
        {
            try
            {
                var userResult = await _retailerUserCreationServices.DeleteUser(ClientId, UserID,  loggedUserId);
                return Ok(new { success = "success", message = "You have successfully Deleted user.", data = userResult });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }
    }
}
