using DealerPortal_API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace DealerPortal_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlantMasterController : ControllerBase
    {
        private readonly IPlantMasterServices _plantMasterServices;
        public PlantMasterController(IPlantMasterServices plantMasterServices)
        {
            _plantMasterServices = plantMasterServices;
        }

        [HttpGet("GetAllPlants")]
        public async Task<IActionResult> GetAllPlants()
        {
            try
            {
                var res = await _plantMasterServices.GetAllPlants();
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Plants not found", data = res });
                }
                return Ok(new { success = "True", message = "Plants fetched successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }

        [HttpPost("addPlant")]
        public async Task<IActionResult> addPlant(PlantDto plantDto)
        {
            try
            {
                var res = await _plantMasterServices.addPlant(plantDto);
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Plant not found", data = res });
                }
                return Ok(new { success = "True", message = "Plant added successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }

        [HttpPost("updatePlant")]
        public async Task<IActionResult> updatePlant(int Id, PlantDto plantDto)
        {
            try
            {
                var res = await _plantMasterServices.updatePlant(Id, plantDto);
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Plant not found", data = res });
                }
                return Ok(new { success = "True", message = "Plant updated successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }

        [HttpDelete("deletePlant")]
        public async Task<IActionResult> deletePlant(int id, string modifiedBy)
        {
            try
            {
                var res = await _plantMasterServices.deletePlant(id, modifiedBy);
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Plant not found", data = res });
                }
                return Ok(new { success = "True", message = "Plant deleted successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }

        [HttpGet("getPlant")]
        public async Task<IActionResult> getPlant(int Id)
        {
            try
            {
                var res = await _plantMasterServices.getPlant(Id);
                if (res == null)
                {
                    return Ok(new { success = "false", message = "Plant not found", data = res });
                }
                return Ok(new { success = "True", message = "Plant fetched successfully", data = res });
            }
            catch (Exception ex)
            {
                return Ok(new { success = "false", message = ex.Message });
            }
        }
    }
}
