using DealerPortal_API.DbContexts;
using DealerPortal_API.Helpers;
using static DealerPortal_API.Models.DealerMaster;
using System.Security.Cryptography;
using System.Text;
using DealerPortal_API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System;

namespace DealerPortal_API.Services
{
    public interface RequisitionServices
    {
        Task<List<MaterialMaster>> GetAllMaterials();
        Task<MaterialMaster> addMaterial(MaterialDto MaterialDtos);
        Task<MaterialMaster> updateMaterial(int Id, MaterialDto MaterialDtos);
        Task<MaterialMaster> deleteMaterial(int id, string modifiedBy);
        Task<MaterialMaster> getMaterial(int id);
        //requisions
        Task<List<Requisitiondto1>> GetAllRequisitions();
        Task<List<RequisitionMaterials>> CreateRequisions(Requisitiondto datadto);
        Task<List<Requisition>> UpdateRequisition(Requisitiondto datadto);
        Task<Requisition> DeleteRequisition(string ClientId, int RequisitionId, string? loggedUserId);
        Task<RequisitionMaterials> deleteRequisitionMaterials(int id, string modifiedBy);
    }
    public class RetailUserService : RequisitionServices
    {
        private readonly IConfiguration _configuration;
        private readonly DealerContext _context;
        public RetailUserService(DealerContext dbContext, IConfiguration configuration)
        {
            _context = dbContext;
            _configuration = configuration;
        }


        //materials 
            public async Task<List<MaterialMaster>> GetAllMaterials()
            {
                try
                {
                    var res = await _context.MaterialMaster.OrderBy(x=>x.MaterialCode).Where(a => a.IsActive == true).ToListAsync();
                    if (res.Count == 0)
                    {
                        throw new Exception("Material not found");
                    }
                    return res;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message ?? "Network Error");
                }
            }
            public async Task<MaterialMaster> addMaterial(MaterialDto MaterialDtos)
            {
                try
                {
                var existingMaterial = await _context.MaterialMaster
         .Where(m => m.MaterialName == MaterialDtos.MaterialName || m.MaterialCode == MaterialDtos.MaterialCode)
         .FirstOrDefaultAsync();

                if (existingMaterial != null)
                {
                    throw new Exception("Material with specified name or code already exists!");
                }
                var ress = new MaterialMaster
                    {
                        MaterialName = MaterialDtos.MaterialName,
                        MaterialCode = MaterialDtos.MaterialCode,
                        IsActive = true,
                        CreatedBy = MaterialDtos.CreatedBy,
                        CreatedOn = System.DateTime.Now,
                    };
                    _context.MaterialMaster.Add(ress);
                    await _context.SaveChangesAsync();
                    return ress;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message ?? "Network Error");
                }
            }
            public async Task<MaterialMaster> updateMaterial(int Id, MaterialDto MaterialDtos)
            {
                try
                {
                    var CompanyToUpdate = await _context.MaterialMaster
                           .Where(a => a.Id == Id)
                           .FirstOrDefaultAsync();
                    if (CompanyToUpdate == null)
                    {
                        throw new Exception("Material not found!");
                    }

                    var checkExisting = await _context.MaterialMaster
                          .Where(a => (a.MaterialName == MaterialDtos.MaterialName || a.MaterialCode == MaterialDtos.MaterialCode) && a.Id != Id )
                          .ToListAsync();
                    if (checkExisting.Count() > 0)
                    {
                        throw new Exception("Material with specified code or name already exist!");
                    }
                    Log.DataLog(
                    MaterialDtos.CreatedBy, $"Existing Material Name {CompanyToUpdate.MaterialName} changed to {MaterialDtos.MaterialName} and existing description {CompanyToUpdate.MaterialCode}" +
                    $"changed to {MaterialDtos.MaterialCode} by the userid {MaterialDtos.CreatedBy}", "Material Master");

                    CompanyToUpdate.MaterialName = MaterialDtos.MaterialName;
                    CompanyToUpdate.MaterialCode = MaterialDtos.MaterialCode;
                    CompanyToUpdate.ModifiedBy = MaterialDtos.CreatedBy;
                    CompanyToUpdate.ModifiedOn = System.DateTime.Now;



                    await _context.SaveChangesAsync();
                    return CompanyToUpdate;
                }
                catch (Exception ex)
                {
                    Log.Error(
       MaterialDtos.CreatedBy, $"While updating the Material id {Id} following error occured {ex.Message}", "Material Master");
                    throw new Exception(ex.Message ?? "Network Error");
                }
            }
            public async Task<MaterialMaster> deleteMaterial(int id, string modifiedBy)
            {
                try
                {
                    var existingCompanyCheck = await _context.MaterialMaster.Where(a => a.Id == id && a.IsActive == true).FirstOrDefaultAsync();

                    if (existingCompanyCheck == null)
                    {
                        throw new Exception("Material Not found");
                    }
                    else
                    {
                        Log.DataLog(
                        modifiedBy, $"Existing Material Name {existingCompanyCheck.MaterialName} Was made Inactive by the User id {modifiedBy}", "Material Master");

                        existingCompanyCheck.IsActive = false;
                        existingCompanyCheck.ModifiedBy = modifiedBy;
                        existingCompanyCheck.ModifiedOn = System.DateTime.Now;
                        await _context.SaveChangesAsync();
                    }
                    return existingCompanyCheck;
                }
                catch (Exception ex)
                {
                    Log.Error(
    modifiedBy, $"While making the inactive to Material id {id} following error occured {ex.Message}", "Material Master");
                    throw new Exception(ex.Message ?? "Network Error");
                }
            }
            public async Task<MaterialMaster> getMaterial(int id)
            {
                try
                {
                    var res = await _context.MaterialMaster.Where(a => a.Id == id && a.IsActive == true).FirstOrDefaultAsync();
                    if (res == null)
                    {
                        throw new Exception("Material not found");
                    }
                    return res;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message ?? "Network Error");
                }
            }

        
        public async Task<List<Requisitiondto1>> GetAllRequisitions()
        {
            try
            {
              
                var requisitionsTask = await _context.Requisition
                    //.Where(a => a.IsActive == true)
                    .ToListAsync();

                var materialsTask = await _context.RequisitionMaterials
                    //.Where(m => m.IsActive == true)
                    .ToListAsync();

                var usersTask = await _context.Users
                    .ToListAsync();

             

                if (!requisitionsTask.Any())
                    throw new Exception("No requisitions found");

                var requisitionDtos = requisitionsTask.Select(r =>
                {
                    // Find user for RetailerName and RequestedBy
                    var retailerUser = usersTask.FirstOrDefault(u => u.UserID.ToString() == r.RetailerId);
                    var createdByUser = usersTask.FirstOrDefault(u => u.UserID.ToString() == r.CreatedBy);

                    return new Requisitiondto1
                    {
                        Id = r.Id,
                        RetailerId = r.RetailerId,
                        RetailerName = retailerUser?.UserName ?? "N/A",
                        RequisitionStatus = r.RequisitionStatus,
                        IsActive = r.IsActive,
                        UserId = r.CreatedBy,
                        RequestedBy = createdByUser?.UserName ?? "N/A",
                        Materials = materialsTask
                            .Where(m => m.RequisitionId == r.Id)
                            .Select(m => new RequisitionMaterialsdto
                            {Id=m.Id,
                                RequisitionId = m.RequisitionId,
                                MaterialCode = m.MaterialCode,
                                MaterialName = m.MaterialName,
                                OrderQuantiy = m.OrderQuantiy, // Matches database field
                                UOM = m.UOM, // Matches JSON expectation
                                ExpectedBy = m.ExpectedBy,
                                Status = m.Status
                            })
                            .ToList()
                    };
                }).ToList();

                return requisitionDtos;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message ?? "Network Error");
            }
        }

        public async Task<List<RequisitionMaterials>> CreateRequisions(Requisitiondto datadto)
        {
            try
            {
                var reqmaterials = new List<RequisitionMaterials>();
                var ress = new Requisition
                {
                   RetailerId=datadto.RetailerId,
              
                    IsActive = true,
                    CreatedBy = datadto.UserId,
                    CreatedOn = System.DateTime.Now,
                    RequisitionStatus=false,
                };
                _context.Requisition.Add(ress);
                await _context.SaveChangesAsync();
                Log.DataLog(datadto.UserId, $"New Requision created with id {ress.Id}", "Create Requisition Log");

                if (datadto.Materials != null)
                {
                    foreach(var mat in datadto.Materials)
                    {
                        var materials = new RequisitionMaterials
                        {

                            RequisitionId = ress.Id,
                            MaterialCode = mat.MaterialCode,
                            MaterialName = mat.MaterialName,
                            OrderQuantiy=mat.OrderQuantiy,
                            UOM= mat.UOM,
                            Status=false,
                            ExpectedBy=mat.ExpectedBy,
                            IsActive = true,
                            CreatedBy = datadto.UserId,
                            CreatedOn = DateTime.Now,
                        };
                        reqmaterials.Add(materials);
                        Log.DataLog(datadto.UserId, $"For the  Requision Id {ress.Id} material code  {mat.MaterialCode} material name {mat.MaterialName} with UOM {mat.UOM} Expected date {mat.ExpectedBy} was added ", "Create Requisition Log");
                    }
                    _context.RequisitionMaterials.AddRangeAsync(reqmaterials);
                   
                }
                await _context.SaveChangesAsync();
                return reqmaterials;
            }
            catch (Exception ex)
            {Log.Error(datadto.UserId, $"While Creating requisions following error occured {ex.Message} ", "Create Requisition Log");
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
        public async Task<List<Requisition>> UpdateRequisition(Requisitiondto datadto)
        {
            try
            {
                // Find the existing requisition
                var checkRequisition = await _context.Requisition
                    //.Include(r => r.Materials)
                    .FirstOrDefaultAsync(x => x.Id == datadto.Id);

                if (checkRequisition == null)
                {
                    Log.Error(datadto.UserId, $"Requisition with ID {datadto.Id} not found.", "Update Requisition Log");
                    throw new Exception("Requisition not found.");
                }

                // Update requisition fields
                checkRequisition.RetailerId = datadto.RetailerId;
                checkRequisition.IsActive = datadto.IsActive;
                checkRequisition.ModifiedBy = datadto.UserId;
                checkRequisition.ModifiedOn = DateTime.Now;
                checkRequisition.RequisitionStatus = false;

                Log.DataLog(datadto.UserId, $"Updated Requisition ID {datadto.Id} with RetailerId {datadto.RetailerId}", "Update Requisition Log");

                // Handle materials
                if (datadto.Materials != null)
                {
                   
                    var incomingMaterialIds = datadto.Materials
                        .Where(m => m.Id.HasValue)
                        .Select(m => m.Id.Value)
                        .ToList();


                    var materialsToRemove = await _context.RequisitionMaterials.Where(x => !incomingMaterialIds.Contains(x.Id) && x.RequisitionId == datadto.Id).ToListAsync();
                    _context.RequisitionMaterials.RemoveRange(materialsToRemove);
                    foreach (var mat in materialsToRemove)
                    {
                        Log.DataLog(datadto.UserId, $"Removed material ID {mat.Id} for Requisition ID {datadto.Id}", "Update Requisition Log");
                    }

                    // Update or add materials
                    var reqMaterials = new List<RequisitionMaterials>();
                    foreach (var mat in datadto.Materials)
                    {
                        if (mat.Id.HasValue)
                        {
                            // Update existing material
                            var existingMaterial = _context.RequisitionMaterials
                                .FirstOrDefault(m => m.Id == mat.Id.Value);
                            if (existingMaterial != null)
                            {
                                existingMaterial.MaterialCode = mat.MaterialCode;
                                existingMaterial.MaterialName = mat.MaterialName;
                                existingMaterial.OrderQuantiy = mat.OrderQuantiy;
                                existingMaterial.UOM = mat.UOM;
                                existingMaterial.ExpectedBy = mat.ExpectedBy;
                                existingMaterial.Status = mat.Status;
                                existingMaterial.IsActive = false;
                                existingMaterial.ModifiedBy = datadto.UserId;
                                existingMaterial.ModifiedOn = DateTime.Now;

                                Log.DataLog(datadto.UserId,
                                    $"Updated material ID {mat.Id} for Requisition ID {datadto.Id}: MaterialCode {mat.MaterialCode}, MaterialName {mat.MaterialName}",
                                    "Update Requisition Log");
                            }
                            else
                            {
                                Log.Error(datadto.UserId,
                                    $"Material ID {mat.Id} not found for Requisition ID {datadto.Id}",
                                    "Update Requisition Log");
                                continue; // Skip invalid material IDs
                            }
                        }
                        else
                        {
                            // Create new material
                            var newMaterial = new RequisitionMaterials
                            {
                                RequisitionId = checkRequisition.Id,
                                MaterialCode = mat.MaterialCode,
                                MaterialName = mat.MaterialName,
                                OrderQuantiy = mat.OrderQuantiy,
                                UOM = mat.UOM,
                                ExpectedBy = mat.ExpectedBy,
                                Status = mat.Status,
                                IsActive = false,
                                CreatedBy = datadto.UserId,
                                CreatedOn = DateTime.Now,
                                ModifiedBy = datadto.UserId,
                                ModifiedOn = DateTime.Now
                            };
                            reqMaterials.Add(newMaterial);
                            Log.DataLog(datadto.UserId,
                                $"Added new material for Requisition ID {datadto.Id}: MaterialCode {mat.MaterialCode}, MaterialName {mat.MaterialName}, UOM {mat.UOM}, ExpectedBy {mat.ExpectedBy}",
                                "Update Requisition Log");
                        }
                    }

                    // Add new materials
                    if (reqMaterials.Any())
                    {
                        await _context.RequisitionMaterials.AddRangeAsync(reqMaterials);
                    }
                }
                else
                {
                    var nomat = await _context.RequisitionMaterials.Where(x => x.RequisitionId == datadto.Id).ToListAsync();
                    _context.RequisitionMaterials.RemoveRange(nomat);
                    Log.DataLog(datadto.UserId,
                        $"Removed all materials for Requisition ID {datadto.Id} as no materials provided",
                        "Update Requisition Log");
                }

                // Save all changes
                await _context.SaveChangesAsync();

                // Refresh the requisition with updated materials
                var updatedRequisition = await _context.Requisition.ToListAsync();
          
                   

                return updatedRequisition;
            }
            catch (Exception ex)
            {
                Log.Error(datadto.UserId,
                    $"Error updating requisition ID {datadto.Id}: {ex.Message}\nStackTrace: {ex.StackTrace}",
                    "Update Requisition Log");
                throw new Exception($"Failed to update requisition: {ex.Message}", ex);
            }
        }

        //public async Task<List<RequisitionMaterials>> UpdateRequisition(Requisitiondto datadto)
        //{
        //    try
        //    {
        //        var reqmaterials = new List<RequisitionMaterials>();
        //        var checkRequisition = await _context.Requisition.Where(x => x.Id == datadto.Id).FirstOrDefaultAsync();
        //        if (checkRequisition != null)
        //        {

        //            checkRequisition.RetailerId = datadto.RetailerId;

        //            checkRequisition.IsActive = true;
        //            checkRequisition.CreatedBy = datadto.UserId;
        //            checkRequisition.CreatedOn = System.DateTime.Now;
        //            checkRequisition.RequisitionStatus = false;
        //                }

        //        //_context.Requisition.Add(ress);
        //        await _context.SaveChangesAsync();
        //        Log.DataLog(datadto.UserId, $"Existing Requision   id {datadto.Id}", "Update Requisition Log");

        //        if (datadto.Materials != null)
        //        {
        //            foreach (var mat in datadto.Materials)
        //            {
        //                var materials = new RequisitionMaterials
        //                {

        //                    RequisitionId = ress.Id,
        //                    MaterialCode = mat.MaterialCode,
        //                    MaterialName = mat.MaterialName,
        //                    OrderQuantiy = mat.OrderQuantiy,
        //                    UOM = mat.UOM,
        //                    Status = false,
        //                    ExpectedBy = mat.ExpectedBy,
        //                    IsActive = true,
        //                    CreatedBy = datadto.UserId,
        //                    CreatedOn = DateTime.Now,
        //                };
        //                reqmaterials.Add(materials);
        //                Log.DataLog(datadto.UserId, $"For the  Requision Id {ress.Id} material code  {mat.MaterialCode} material name {mat.MaterialName} with UOM {mat.UOM} Expected date {mat.ExpectedBy} was added ", "Create Requisition Log");
        //            }
        //            _context.RequisitionMaterials.AddRangeAsync(reqmaterials);

        //        }
        //        await _context.SaveChangesAsync();
        //        return reqmaterials;
        //    }
        //    catch (Exception ex)
        //    {
        //        Log.Error(datadto.UserId, $"While Creating requisions following error occured {ex.Message} ", "Create Requisition Log");
        //        throw new Exception(ex.Message ?? "Network Error");
        //    }
        //}
        public async Task<Requisition> DeleteRequisition(string ClientId, int RequisitionID, string? loggedUserId)
        {
            try
            {
               
                var requisition = await _context.Requisition
                    .FirstOrDefaultAsync(x => x.Id == RequisitionID);

                if (requisition == null)
                {
                    throw new Exception("Requisition not found or does not belong to the specified client.");
                }

                var materials = await _context.RequisitionMaterials
                    .Where(x => x.RequisitionId == RequisitionID)
                    .ToListAsync();

              
                if (materials.Any())
                {
                    _context.RequisitionMaterials.RemoveRange(materials);
                }

                Log.DataLog(loggedUserId, $"Requisition id {RequisitionID} and respective materials deleted from the records by the user id {loggedUserId} ", "Delete Requisition Log");
                _context.Requisition.Remove(requisition);

                await _context.SaveChangesAsync();

            
                if (!string.IsNullOrEmpty(loggedUserId))
                {
                  
                }

                return requisition;
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to delete requisition: {ex.Message}", ex);
            }
        }

        public async Task<RequisitionMaterials> deleteRequisitionMaterials(int id, string modifiedBy)
        {
            try
            {
                var existingCompanyCheck = await _context.RequisitionMaterials.Where(a => a.Id == id ).FirstOrDefaultAsync();

                if (existingCompanyCheck == null)
                {
                    throw new Exception("Material Not found");
                }
                else
                {
                    Log.DataLog(
                    modifiedBy, $"Existing Material  {existingCompanyCheck.MaterialName} Was deleted by the User id {modifiedBy}", "Delete Requisition Materials");

                    //existingCompanyCheck.IsActive = false;
                    //existingCompanyCheck.ModifiedBy = modifiedBy;
                    //existingCompanyCheck.ModifiedOn = System.DateTime.Now;
                    _context.RequisitionMaterials.RemoveRange(existingCompanyCheck);
                    await _context.SaveChangesAsync();
                }
                return existingCompanyCheck;
            }
            catch (Exception ex)
            {
                Log.Error(
modifiedBy, $"While making the inactive to Material id {id} following error occured {ex.Message}", "Material Master");
                throw new Exception(ex.Message ?? "Network Error");
            }
        }
    }
}

