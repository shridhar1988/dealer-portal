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
                var res = await _context.CompanyPlantMapping.Where(a => a.IsActive == true).ToListAsync();
                //if (res.Count == 0)
                //{
                //    throw new Exception("Company Plant mapping not found");
                //}
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
                var res = await _context.CompanyPlantMapping.Where(a => a.IsActive == true && a.CompanyId==companyId).ToListAsync();
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
                var existingCompany = await _context.CompanyPlantMapping.Where(a => a.CompanyId == companyPlantMappingDto.CompanyId && a.PlantId == companyPlantMappingDto.PlantId && a.IsActive == true).ToListAsync();
                if (existingCompany.Count > 0)
                {
                    throw new Exception("Company & Plant mapping already exist..!");
                }
                var ress = new CompanyPlantMapping
                {
                    CompanyId = companyPlantMappingDto.CompanyId,
                    PlantId = companyPlantMappingDto.PlantId,
                    //Description=companyPlantMappingDto.Description,
                    IsActive = true,
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
                       .Where(a => a.Id == Id && a.IsActive == true)
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
                Log.DataLog(
companyPlantMappingDto.ModifiedBy, $"Existing Company Id {CompanyToUpdate.CompanyId} changed to {companyPlantMappingDto.CompanyId} and existing mapped plantid {CompanyToUpdate.PlantId}" +
$"changed to {companyPlantMappingDto.PlantId} by the userid {companyPlantMappingDto.ModifiedBy}", "Company Plant Mapping");



                CompanyToUpdate.CompanyId = companyPlantMappingDto.CompanyId;
                CompanyToUpdate.PlantId = companyPlantMappingDto.PlantId;
                CompanyToUpdate.ModifiedBy = companyPlantMappingDto.ModifiedBy;
                CompanyToUpdate.ModifiedOn = System.DateTime.Now;
      await _context.SaveChangesAsync();
                return CompanyToUpdate;
            }
            catch (Exception ex)
            {
                Log.Error(
companyPlantMappingDto.ModifiedBy, $"While updating the company plant mapping id {Id} following error occured {ex.Message}", "Company Plant Mapping");
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<CompanyPlantMapping> deleteCompanyPlantMapping(int id, string modifiedBy)
        {
            try
            {
                var existingCompanyCheck = await _context.CompanyPlantMapping.Where(a => a.Id == id && a.IsActive == true).FirstOrDefaultAsync();

                if (existingCompanyCheck == null)
                {
                    throw new Exception("Company Not found");
                }
                else
                {
                    Log.DataLog(
 modifiedBy, $"Existing Company Plant Mapping id {id} Was Inactive by the User id {modifiedBy}", "Company Plant Mapping");

                    existingCompanyCheck.IsActive = true;
                    existingCompanyCheck.ModifiedBy = modifiedBy;
                    existingCompanyCheck.ModifiedOn = System.DateTime.Now;
                    _context.CompanyPlantMapping.RemoveRange(existingCompanyCheck);
                 await _context.SaveChangesAsync();
                }
                return existingCompanyCheck;
            }
            catch (Exception ex)
            {
                Log.Error(
modifiedBy, $"While making the inactive  company plant mapping id {id} following error occured {ex.Message}", "Company Plant Mapping");
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<CompanyPlantMapping> getCompanyPlantMapping(int id)
        {
            try
            {
                var res = await _context.CompanyPlantMapping.Where(a => a.Id==id && a.IsActive == true).FirstOrDefaultAsync();
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
