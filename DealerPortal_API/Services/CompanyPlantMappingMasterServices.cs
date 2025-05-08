using DealerPortal_API.DbContexts;
using Microsoft.EntityFrameworkCore;
using static DealerPortal_API.Models.DealerMaster;

namespace DealerPortal_API.Services
{
    public interface ICompanyPlantMappingMasterServices
    {
        Task<List<CompanyPlantMapping>> GetAllCompanyPlantMappings();
        Task<CompanyPlantMapping> addCompanyPlantMapping(CompanyPlantMappingDto companyPlantMappingDto);
        Task<CompanyPlantMapping> updateCompanyPlantMapping(int Id, CompanyPlantMappingDto companyPlantMappingDto);
        Task<CompanyPlantMapping> deleteCompanyPlantMapping(int id, string modifiedBy);
        Task<CompanyPlantMapping> getCompanyPlantMapping(int id);
        Task<List<CompanyPlantMapping>> GetAllCompanyPlantMappingsBasedOnCompanyId(string companyId);
    }
    public class CompanyPlantMappingMasterServices:ICompanyPlantMappingMasterServices
    {
        private readonly DealerContext _context;
        public CompanyPlantMappingMasterServices(DealerContext context)
        {
            _context = context;
        }
        public async Task<List<CompanyPlantMapping>> GetAllCompanyPlantMappings()
        {
            try
            {
                var res = await _context.CompanyPlantMapping.Where(a => a.IsActive == false).ToListAsync();
                if (res.Count == 0)
                {
                    throw new Exception("Company Plant mapping not found");
                }
                return res;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<List<CompanyPlantMapping>> GetAllCompanyPlantMappingsBasedOnCompanyId(string companyId)
        {
            try
            {
                var res = await _context.CompanyPlantMapping.Where(a => a.IsActive == false && a.CompanyId==companyId).ToListAsync();
                if (res.Count == 0)
                {
                    throw new Exception("Company Plant mapping not found");
                }
                return res;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<CompanyPlantMapping> addCompanyPlantMapping(CompanyPlantMappingDto companyPlantMappingDto)
        {
            try
            {
                var existingCompany = await _context.CompanyPlantMapping.Where(a => a.CompanyId == companyPlantMappingDto.CompanyId && a.PlantId == companyPlantMappingDto.PlantId && a.IsActive == false).ToListAsync();
                if (existingCompany.Count > 0)
                {
                    throw new Exception("Company & Plant mapping already exist..!");
                }
                var ress = new CompanyPlantMapping
                {
                    CompanyId = companyPlantMappingDto.CompanyId,
                    PlantId = companyPlantMappingDto.PlantId,
                    Description=companyPlantMappingDto.Description,
                    IsActive = false,
                    CreatedBy = companyPlantMappingDto.ModifiedBy,
                    CreatedOn = System.DateTime.Now,
                };
                _context.CompanyPlantMapping.Add(ress);
                await _context.SaveChangesAsync();
                return ress;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<CompanyPlantMapping> updateCompanyPlantMapping(int Id, CompanyPlantMappingDto companyPlantMappingDto)
        {
            try
            {
                var CompanyToUpdate = await _context.CompanyPlantMapping
                       .Where(a => a.Id == Id && a.IsActive == false)
                       .FirstOrDefaultAsync();
                if (CompanyToUpdate == null)
                {
                    throw new Exception("Company not found!");
                }

                var checkExisting = await _context.CompanyPlantMapping
                      .Where(a => a.CompanyId == companyPlantMappingDto.CompanyId && a.PlantId==companyPlantMappingDto.PlantId && a.IsActive == false)
                      .ToListAsync();
                if (checkExisting.Count() > 0)
                {
                    throw new Exception("Company and plant mapping already exist!");
                }

                CompanyToUpdate.CompanyId = companyPlantMappingDto.CompanyId;
                CompanyToUpdate.PlantId = companyPlantMappingDto.PlantId;
                CompanyToUpdate.ModifiedBy = companyPlantMappingDto.ModifiedBy;
                CompanyToUpdate.ModifiedOn = System.DateTime.Now;

                await _context.SaveChangesAsync();
                return CompanyToUpdate;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<CompanyPlantMapping> deleteCompanyPlantMapping(int id, string modifiedBy)
        {
            try
            {
                var existingCompanyCheck = await _context.CompanyPlantMapping.Where(a => a.Id == id && a.IsActive == false).FirstOrDefaultAsync();

                if (existingCompanyCheck == null)
                {
                    throw new Exception("Company Not found");
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
        public async Task<CompanyPlantMapping> getCompanyPlantMapping(int id)
        {
            try
            {
                var res = await _context.CompanyPlantMapping.Where(a => a.Id==id && a.IsActive == false).FirstOrDefaultAsync();
                if (res == null)
                {
                    throw new Exception("Company Plant mapping not found");
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
