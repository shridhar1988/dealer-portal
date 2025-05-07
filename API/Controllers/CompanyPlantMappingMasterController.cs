using DealerPortal_API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace DealerPortal_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyPlantMappingMasterController : ControllerBase
    {
        private readonly ICompanyPlantMappingMasterServices _companyMasterServices;
        public CompanyPlantMappingMasterController(ICompanyPlantMappingMasterServices companyMasterServices)
        {
            _companyMasterServices = companyMasterServices;
        }

        [HttpGet("GetAllCompanyPlantMappings")]
        public async Task<IActionResult> GetAllCompanyPlantMappings()
        {
            try
            {
                var res = await _companyMasterServices.GetAllCompanyPlantMappings();
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Company & Plant mapping not found", data = res });
                }
                return Ok(new { success = "True", message = "Company & Plant mapping fetched successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }

        [HttpGet("GetAllCompanyPlantMappingsBasedOnCompanyId")]
        public async Task<IActionResult> GetAllCompanyPlantMappingsBasedOnCompanyId(string companyId)
        {
            try
            {
                var res = await _companyMasterServices.GetAllCompanyPlantMappingsBasedOnCompanyId(companyId);
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Company & Plant mapping not found", data = res });
                }
                return Ok(new { success = "True", message = "Company & Plant mapping fetched successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }

        [HttpPost("addCompanyPlantMapping")]
        public async Task<IActionResult> addCompanyPlantMapping(CompanyPlantMappingDto companyDtos)
        {
            try
            {
                var res = await _companyMasterServices.addCompanyPlantMapping(companyDtos);
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Company & Plant not added", data = res });
                }
                return Ok(new { success = "True", message = "Company & Plant added successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }

        [HttpPost("updateCompanyPlantMapping")]
        public async Task<IActionResult> updateCompanyPlantMapping(int Id, CompanyPlantMappingDto companyDtos)
        {
            try
            {
                var res = await _companyMasterServices.updateCompanyPlantMapping(Id, companyDtos);
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Company & Plant not found", data = res });
                }
                return Ok(new { success = "True", message = "Company & Plant updated successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }

        [HttpPost("deleteCompanyPlantMapping")]
        public async Task<IActionResult> deleteCompanyPlantMapping(int id, string modifiedBy)
        {
            try
            {
                var res = await _companyMasterServices.deleteCompanyPlantMapping(id, modifiedBy);
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Company & Plant not found", data = res });
                }
                return Ok(new { success = "True", message = "Company & Plant deleted successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }

        [HttpGet("getCompanyPlantMapping")]
        public async Task<IActionResult> getCompanyPlantMapping(int Id)
        {
            try
            {
                var res = await _companyMasterServices.getCompanyPlantMapping(Id);
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Company & Plant not found", data = res });
                }
                return Ok(new { success = "True", message = "Company & Plant fetched successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }
    }
}
