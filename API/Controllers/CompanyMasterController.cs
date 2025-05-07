using DealerPortal_API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace DealerPortal_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyMasterController : ControllerBase
    {
        private readonly ICompanyMasterServices _companyMasterServices;
        public CompanyMasterController(ICompanyMasterServices companyMasterServices)
        {
            _companyMasterServices = companyMasterServices;
        }

        [HttpGet("GetAllCompany")]
        public async Task<IActionResult> GetAllCompany()
        {
            try
            {
                var res = await _companyMasterServices.GetAllCompany();
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Company not found", data = res });
                }
                return Ok(new { success = "True", message = "Companys fetched successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }

        [HttpPost("addCompany")]
        public async Task<IActionResult> addCompany(CompanyDto companyDtos)
        {
            try
            {
                var res = await _companyMasterServices.addCompany(companyDtos);
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Company not found", data = res });
                }
                return Ok(new { success = "True", message = "Company added successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }

        [HttpPut("updateCompany")]
        public async Task<IActionResult> updateCompany(int Id, CompanyDto companyDtos)
        {
            try
            {
                var res = await _companyMasterServices.updateCompany(Id, companyDtos);
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Company not found", data = res });
                }
                return Ok(new { success = "True", message = "Company updated successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }

        [HttpDelete("deleteCompany")]
        public async Task<IActionResult> deleteCompany(int id, string modifiedBy)
        {
            try
            {
                var res = await _companyMasterServices.deleteCompany(id, modifiedBy);
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Company not found", data = res });
                }
                return Ok(new { success = "True", message = "Company deleted successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }

        [HttpGet("getCompanyById")]
        public async Task<IActionResult> getCompanyById(int Id)
        {
            try
            {
                var res = await _companyMasterServices.getCompanyById(Id);
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Company not found", data = res });
                }
                return Ok(new { success = "True", message = "Company fetched successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }

    }
}
