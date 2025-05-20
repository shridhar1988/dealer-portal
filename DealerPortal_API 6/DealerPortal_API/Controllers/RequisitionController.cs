using DealerPortal_API.Models;
using DealerPortal_API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static DealerPortal_API.Models.DealerMaster;

namespace DealerPortal_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequisitionController : ControllerBase
    {
        private readonly RequisitionServices _requisitionServices;
        public RequisitionController(RequisitionServices retailerUserCreationServices)
        {
            _requisitionServices = retailerUserCreationServices;
        }

        [HttpGet("GetAllMaterials")]
        public async Task<IActionResult> GetAllMaterials()
        {
            try
            {
                var res = await _requisitionServices.GetAllMaterials();
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Materials not found", data = res });
                }
                return Ok(new { success = "True", message = "Materials fetched successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }

        [HttpPost("addMaterial")]
        public async Task<IActionResult> addMaterial(MaterialDto MaterialDto)
        {
            try
            {
                var res = await _requisitionServices.addMaterial(MaterialDto);
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Material not found", data = res });
                }
                Log.DataLog(
                   MaterialDto.CreatedBy, $"Material Name {MaterialDto.MaterialName} added with Material Code" +
                   $" {MaterialDto.MaterialCode} by the userid {MaterialDto.CreatedBy}", "Material Master");
                return Ok(new { success = "True", message = "Material added successfully", data = res });
            }
            catch (Exception ex)
            {
                Log.Error(
       MaterialDto.CreatedBy, $"While creating the Material {MaterialDto.MaterialName} following error occured {ex.Message} " +
       $"", "Material Master");

                return Ok(new { success = "false", message = ex.Message });
            }
        }

        [HttpPost("updateMaterial")]
        public async Task<IActionResult> updateMaterial(int Id, MaterialDto MaterialDto)
        {
            try
            {
                var res = await _requisitionServices.updateMaterial(Id, MaterialDto);
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Material not found", data = res });
                }
                return Ok(new { success = "True", message = "Material updated successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }

        [HttpDelete("deleteMaterial")]
        public async Task<IActionResult> deleteMaterial(int id, string modifiedBy)
        {
            try
            {
                var res = await _requisitionServices.deleteMaterial(id, modifiedBy);
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Material not found", data = res });
                }
                return Ok(new { success = "True", message = "Material deleted successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }

        [HttpGet("getMaterial")]
        public async Task<IActionResult> getMaterial(int Id)
        {
            try
            {
                var res = await _requisitionServices.getMaterial(Id);
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Material not found", data = res });
                }
                return Ok(new { success = "True", message = "Material fetched successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }
//requisitions
        [HttpGet("GetAllRequisitions")]
        public async Task<IActionResult> GetAllRequisitions()
        {
            try
            {
                var res = await _requisitionServices.GetAllRequisitions();
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Requisions not found", data = res });
                }
                return Ok(new { success = "True", message = "Requisions fetched successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }

        [HttpPost("CreateRequisition")]
        public async Task<IActionResult> CreateRequisition(Requisitiondto datadto)
        {
            try
            {
                var res = await _requisitionServices.CreateRequisions(datadto);
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Requisions not found", data = res });
                }
                return Ok(new { success = "True", message = "Requisions created successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }
        [HttpPost("UpdateRequisition")]
        public async Task<IActionResult> UpdateRequisition(Requisitiondto datadto)
        {
            try
            {
                var res = await _requisitionServices.UpdateRequisition(datadto);
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Requisions not found", data = res });
                }
                return Ok(new { success = "True", message = "Requisions updated successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }


        [HttpPost("DeleteRequisition")]
        public async Task<ActionResult<Requisition>> DeleteRequisition(string ClientId, int RequisitionId, string? loggedUserId)
        {
            try
            {
                var userResult = await _requisitionServices.DeleteRequisition(ClientId, RequisitionId, loggedUserId);
                return Ok(new { success = "success", message = "You have successfully Deleted user.", data = userResult });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }

        [HttpDelete("deleteRequisitionMaterials")]
        public async Task<IActionResult> deleteRequisitionMaterials(int id, string modifiedBy)
        {
            try
            {
                var res = await _requisitionServices.deleteRequisitionMaterials(id, modifiedBy);
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Materials not found", data = res });
                }
                return Ok(new { success = "True", message = "Materials deleted successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }

    }
}
