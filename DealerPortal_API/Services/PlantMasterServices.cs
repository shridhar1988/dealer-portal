using DealerPortal_API.DbContexts;
using Microsoft.EntityFrameworkCore;
using static DealerPortal_API.Models.DealerMaster;

namespace DealerPortal_API.Services
{
    public interface IPlantMasterServices
    {
        Task<List<Plant>> GetAllPlants();
        Task<Plant> addPlant(PlantDto plantDtos);
        Task<Plant> updatePlant(int Id, PlantDto plantDtos);
        Task<Plant> deletePlant(int id, string modifiedBy);
        Task<Plant> getPlant(int id);
    }

    public class PlantMasterServices:IPlantMasterServices
    {
        private readonly DealerContext _context;
        public PlantMasterServices(DealerContext context)
        {
            _context = context;
        }
        public async Task<List<Plant>> GetAllPlants()
        {
            try
            {
                var res = await _context.Plant.Where(a => a.IsActive == false).ToListAsync();
                if (res.Count == 0)
                {
                    throw new Exception("Plant not found");
                }
                return res;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<Plant> addPlant(PlantDto plantDtos)
        {
            try
            {
                var existingCompany = await _context.Plant.Where(a => a.PlantName == plantDtos.PlantName && a.IsActive == false).ToListAsync();
                if (existingCompany.Count > 0)
                {
                    throw new Exception("Plant with specified name already exist..!");
                }
                var ress = new Plant
                {
                    PlantName = plantDtos.PlantName,
                    PlantDescription = plantDtos.PlantDescription,
                    IsActive = false,
                    CreatedBy = plantDtos.CreatedBy,
                    CreatedOn = System.DateTime.Now,
                };
                _context.Plant.Add(ress);
                await _context.SaveChangesAsync();
                return ress;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<Plant> updatePlant(int Id, PlantDto plantDtos)
        {
            try
            {
                var CompanyToUpdate = await _context.Plant
                       .Where(a => a.Id == Id && a.IsActive == false)
                       .FirstOrDefaultAsync();
                if (CompanyToUpdate == null)
                {
                    throw new Exception("Plant not found!");
                }

                var checkExisting = await _context.Plant
                      .Where(a => a.PlantName == plantDtos.PlantName && a.IsActive == false)
                      .ToListAsync();
                if (checkExisting.Count() > 0)
                {
                    throw new Exception("Plant with specified name already exist!");
                }

                CompanyToUpdate.PlantName = plantDtos.PlantName;
                CompanyToUpdate.PlantDescription = plantDtos.PlantDescription;
                CompanyToUpdate.ModifiedBy = plantDtos.CreatedBy;
                CompanyToUpdate.ModifiedOn = System.DateTime.Now;

                await _context.SaveChangesAsync();
                return CompanyToUpdate;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<Plant> deletePlant(int id, string modifiedBy)
        {
            try
            {
                var existingCompanyCheck = await _context.Plant.Where(a => a.Id == id && a.IsActive == false).FirstOrDefaultAsync();

                if (existingCompanyCheck == null)
                {
                    throw new Exception("Plant Not found");
                }
                else
                {
                    existingCompanyCheck.IsActive = true;
                    existingCompanyCheck.ModifiedBy = modifiedBy;
                    existingCompanyCheck.ModifiedOn = System.DateTime.Now;
                    await _context.SaveChangesAsync();
                }
                return existingCompanyCheck;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<Plant> getPlant(int id)
        {
            try
            {
                var res = await _context.Plant.Where(a => a.Id == id && a.IsActive == false).FirstOrDefaultAsync();
                if (res == null)
                {
                    throw new Exception("Plant not found");
                }
                return res;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
    }
}
