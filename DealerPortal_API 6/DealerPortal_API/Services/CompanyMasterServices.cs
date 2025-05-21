using DealerPortal_API.DbContexts;
using Microsoft.EntityFrameworkCore;
using static DealerPortal_API.Models.DealerMaster;

namespace DealerPortal_API.Services
{
    public interface ICompanyMasterServices
    {
        Task<List<Company>> GetAllCompany();
        Task<Company> addCompany(CompanyDto companyDtos);
        Task<Company> updateCompany(int Id, CompanyDto companyDtos);
        Task<Company> deleteCompany(int id, string modifiedBy);
        Task<Company> getCompanyById(int id);
    }
    public class CompanyMasterServices:ICompanyMasterServices
    {
        private readonly DealerContext _context;
        public CompanyMasterServices(DealerContext context)
        {
            _context = context;
        }
        public async Task<List<Company>> GetAllCompany()
        {
            try
            {
                var res = await _context.Company.OrderBy(X=>X.CompanyCode).Where(a => a.IsActive == true).ToListAsync();
                //if (res.Count == 0)
                //{
                //    throw new Exception("Company not found");
                //}
                return res;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<Company> addCompany(CompanyDto companyDtos)
        {
            try
            {
                var existingCompany = await _context.Company.Where(a => a.CompanyCode == companyDtos.CompanyCode && a.IsActive == true).ToListAsync();
                if (existingCompany.Count > 0)
                {
                    throw new Exception("Company name already exist");
                }
                var ress = new Company
                {
                    CompanyCode = companyDtos.CompanyCode,
                    CompanyDescription = companyDtos.CompanyDescription,
                    IsActive = true,
                    CreatedBy = companyDtos.CreatedBy,
                    CreatedOn = System.DateTime.Now,
                };
                _context.Company.Add(ress);
                await _context.SaveChangesAsync();
                return ress;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<Company> updateCompany(int Id, CompanyDto companyDtos)
        {
            try
            {
                var CompanyToUpdate = await _context.Company
                       .Where(a => a.Id==Id && a.IsActive == true)
                       .FirstOrDefaultAsync();
                if (CompanyToUpdate == null)
                {
                    throw new Exception("Company not found!");
                }

                var checkExisting = await _context.Company
                      .Where(a => a.CompanyCode == companyDtos.CompanyCode && a.IsActive == true && a.Id != Id)
                      .ToListAsync();
                if (checkExisting.Count()>0)
                {
                    throw new Exception("Company name exist");
                }
                Log.DataLog(
            companyDtos.CreatedBy, $"Existing Company Name {CompanyToUpdate.CompanyCode} changed to {companyDtos.CompanyCode} and existing description {CompanyToUpdate.CompanyDescription}" +
            $"changed to {companyDtos.CompanyDescription} by the userid {companyDtos.CreatedBy}", "Company Master");
                CompanyToUpdate.CompanyCode = companyDtos.CompanyCode;
                CompanyToUpdate.CompanyDescription= companyDtos.CompanyDescription;
                CompanyToUpdate.ModifiedBy=companyDtos.CreatedBy;
                CompanyToUpdate.ModifiedOn=System.DateTime.Now;
            
                await _context.SaveChangesAsync();             
                return CompanyToUpdate;
            }
            catch (Exception ex)
            {
                Log.Error(
                companyDtos.CreatedBy, $"While updating the company id {Id} following error occured {ex.Message}", "Company Master");

                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<Company> deleteCompany(int id, string modifiedBy)
        {
            try
            {
                var existingCompanyCheck = await _context.Company.Where(a => a.Id == id && a.IsActive == true).FirstOrDefaultAsync();

                if (existingCompanyCheck == null)
                {
                    throw new Exception("Company Not found");
                }
                else
                {
                    Log.DataLog(
                  modifiedBy, $"Existing Company Name {existingCompanyCheck.CompanyCode} Was made Inactive by the User id {modifiedBy}", "Company Master");

                    existingCompanyCheck.IsActive = false;
                    existingCompanyCheck.ModifiedBy = modifiedBy;
                    existingCompanyCheck.ModifiedOn = System.DateTime.Now;
                    _context.Company.RemoveRange(existingCompanyCheck);
                    await _context.SaveChangesAsync();
                }              
                return existingCompanyCheck;
            }
            catch (Exception ex)
            {
                Log.Error(
                 modifiedBy, $"While making the inactive to company id {id} following error occured {ex.Message}", "Company Master");
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<Company> getCompanyById(int id)
        {
            try
            {
                var res = await _context.Company.Where(a => a.Id == id && a.IsActive == true).FirstOrDefaultAsync();
                //if (res == null)
                //{
                //    throw new Exception("Company not found");
                //}
                return res;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

    }
}
