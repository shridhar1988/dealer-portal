
using Microsoft.EntityFrameworkCore;
using Ticketing_API.DbContexts;


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
        private readonly DealerPortalContext _context;
        public CompanyMasterServices(DealerPortalContext context)
        {
            _context = context;
        }
        public async Task<List<Company>> GetAllCompany()
        {
            try
            {
                var res = await _context.Company.Where(a => a.IsActive == false).ToListAsync();
                if (res.Count == 0)
                {
                    throw new Exception("Company not found");
                }
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
                var existingCompany = await _context.Company.Where(a => a.CompanyName == companyDtos.CompanyName && a.IsActive == false).ToListAsync();
                if (existingCompany.Count > 0)
                {
                    throw new Exception("Company with specified name already exist..!");
                }
                var ress = new Company
                {
                    CompanyName = companyDtos.CompanyName,
                    CompanyDescription = companyDtos.CompanyDescription,
                    IsActive = false,
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
                       .Where(a => a.Id==Id && a.IsActive == false)
                       .FirstOrDefaultAsync();
                if (CompanyToUpdate == null)
                {
                    throw new Exception("Company not found!");
                }

                var checkExisting = await _context.Company
                      .Where(a => a.CompanyName == companyDtos.CompanyName && a.IsActive == false)
                      .ToListAsync();
                if (checkExisting.Count()>0)
                {
                    throw new Exception("Company with specified name already exist!");
                }

                CompanyToUpdate.CompanyName = companyDtos.CompanyName;
                CompanyToUpdate.CompanyDescription= companyDtos.CompanyDescription;
                CompanyToUpdate.ModifiedBy=companyDtos.CreatedBy;
                CompanyToUpdate.ModifiedOn=System.DateTime.Now;

                await _context.SaveChangesAsync();             
                return CompanyToUpdate;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<Company> deleteCompany(int id, string modifiedBy)
        {
            try
            {
                var existingCompanyCheck = await _context.Company.Where(a => a.Id == id && a.IsActive == false).FirstOrDefaultAsync();

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
        public async Task<Company> getCompanyById(int id)
        {
            try
            {
                var res = await _context.Company.Where(a => a.Id == id && a.IsActive == false).FirstOrDefaultAsync();
                if (res == null)
                {
                    throw new Exception("Company not found");
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
