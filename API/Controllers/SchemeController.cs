using DealerPortal_API.Models;
using DealerPortal_API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Threading.Tasks;
using Ticketing_API.DbContexts;
using Ticketing_API.Services;

namespace DealerPortal_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SchemeController : ControllerBase
    {

        private readonly DealerPortalContext _dbContext;
        private readonly IConfiguration _configuration;
        private readonly AuthMasterSerices _authMasterService;
        private readonly int _tokenTimespan; private readonly DocumentService _docservice;

        public SchemeController(DealerPortalContext dbContext, DocumentService docservice, IConfiguration configuration, AuthMasterSerices authMasterService)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            _authMasterService = authMasterService; _docservice = docservice;
        }

        [HttpGet("GetAllSchemes")]
        public async Task<IActionResult> GetAllSchemes()
        {
            try
            {
                var users = await (from sc in _dbContext.Scheme
                                   select new
                                   {
                                       sc.Id, sc.ReferenceId, sc.ValidFrom, sc.ValidTo, sc.Type, sc.Active, sc.CreatedUser, sc.CreationDate,
                                       sc.CreatedBy, sc.CreatedOn, sc.ModifiedBy, sc.ModifiedOn,
                                       Attachments = (from dm in _dbContext.DocumentMaster
                                                      where dm.DocumentId == sc.Id.ToString() && dm.DocumentType == "SchemeDocuments"
                                                      select new
                                                      {
                                                          dm.Id,
                                                          SchemeId = dm.DocumentId,
                                                          dm.DocumentName,
                                                          dm.DocumentExtention,
                                                          dm.DocumentURL,
                                                          dm.DocumentType,
                                                          dm.CreatedOn,
                                                          dm.CreatedBy,
                                                          dm.ModifiedBy,
                                                          dm.ModifiedOn
                                                      }).ToList()

                                   }).ToListAsync();
                //return Ok(users);
                return Ok(new { success = "success", message = "You have successfully get user data", data = users });

            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }


        [HttpPost("CreateScheme")]
        public async Task<IActionResult> CreateScheme([FromForm] Schemedto data)
        {



            if (data == null)
            {
                Log.Error($"{data.UserId}", "Sceme Data is null ","Scheme");
                    return Ok(new { success = false, message = "Please fill all fields" });
            }
            if (data.UserId == null)
            {
                Log.Error($"{data.UserId}", "UserId missing to update ", "Scheme");
                return Ok(new { success = false, message = "Provide the UserId" });
            }
            var strategy = _dbContext.Database.CreateExecutionStrategy();
            int schemeId = data.Id;
            List<Scheme> SchemeData = new List<Scheme>();

            var existingemail = await _dbContext.Scheme.Where(x => x.ReferenceId == data.ReferenceId).FirstOrDefaultAsync();
            if (existingemail != null)
            {
                return Ok(new { success = false, message = $"Scheme with same reference Id already Exist" });
            }

            return await strategy.ExecuteAsync(async () =>
            {
                using (var transaction = await _dbContext.Database.BeginTransactionAsync())
                {
                    var strategy = _dbContext.Database.CreateExecutionStrategy();



                    try
                    {

                        var existingData = await _dbContext.Scheme.Where(x => x.Id == data.Id).FirstOrDefaultAsync();


                        if (existingData != null)
                        {

                          
                            schemeId = data.Id;
                            List<string> updatedFields = new List<string>();

                            void UpdateField<T>(string fieldName, T existingValue, T newValue, Action<T> updateAction)
                            {
                                if (!EqualityComparer<T>.Default.Equals(existingValue, newValue))
                                {
                                    updateAction(newValue);


                                    updatedFields.Add($"{fieldName}: Existing Data : \"{existingValue}\" Updated to \"{newValue}\"");
                                }
                            }
                            UpdateField("ValidFrom", existingData.ValidFrom, data.ValidFrom, val => existingData.ValidFrom = val);
                            UpdateField("ValidTo", existingData.ValidTo, data.ValidTo, val => existingData.ValidTo = val);
                            UpdateField("CreationDate", existingData.CreationDate, data.CreationDate, val => existingData.Type = val);
                            UpdateField("Type", existingData.Type, data.Type, val => existingData.Type = val);

                            UpdateField("CreatedUser", existingData.CreatedUser, data.CreatedUser, val => existingData.CreatedUser = val);
                           

                            existingData.ModifiedOn = DateTime.Now;
                            existingData.ModifiedBy = data.UserId;


                            if (updatedFields.Any())
                            {

                               Log.DataLog($"{data.UserId}",$"Scheme Id {data.Id} updated fields: {string.Join(", ", updatedFields)} By the userId :{data.UserId}","Scheme");
                            }

                            _dbContext.Scheme.Update(existingData);

                            if (data.Documents != null)
                            {
                                var documentDto = new Documentdto
                                {
                                    Id = data.Id.ToString(),
                                    Documents = data.Documents,
                                    documentType = "SchemeDocuments",
                                    FolderName = "SchemeDocuments",
                                    UserID = data.UserId
                                };
                                await _docservice.DocumentsUpload(documentDto);
                            }

                            SchemeData.Add(existingData);
                        }
                        else
                        {
                            // Create new vendor
                            var newdata = new Scheme
                            {
                                ReferenceId = data.ReferenceId,
                                ValidFrom = data.ValidFrom,
                                ValidTo=data.ValidTo,
                                CreatedUser = data.CreatedUser,
                                CreationDate=data.CreationDate,
                                Type = data.Type,                              
                                CreatedOn = DateTime.Now,
                                CreatedBy = data.UserId,
                              

                            };

                            await _dbContext.Scheme.AddAsync(newdata);
                            await _dbContext.SaveChangesAsync();
                            schemeId = newdata.Id;
                            SchemeData.Add(newdata);
                         Log.DataLog(data.UserId,$"New Scheme created. Scheme Id : {schemeId} " +
                             $"Reference Id : {data.ReferenceId}, Type : {data.Type} by the User Id : {data.UserId}","Scheme");
                         

                            if (data.Documents != null)
                            {
                                var documentDto = new Documentdto
                                {
                                    Id = data.Id.ToString(),
                                    Documents = data.Documents,
                                    documentType = "SchemeDocuments",
                                    FolderName = "SchemeDocuments",
                                    UserID = data.UserId
                                };
                                await _docservice.DocumentsUpload(documentDto);
                            }


                        }


                        await _dbContext.SaveChangesAsync();
                        await transaction.CommitAsync();
                        return Ok(new { success = true, message = "data details added successfully", data = SchemeData });



                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        Log.Error($"{data.UserId}",$"Error occured while Adding the data :{ex.Message}","Scheme");
                        return Ok(new { success = false, message = ex.Message });
                    }
                }
            });
        }


        [HttpGet("GetAllSchemesById")]
        public async Task<IActionResult> GetAllSchemes(int Id)
        {
            try
            {
                var users = await (from sc in _dbContext.Scheme
                                   where sc.Id == Id
                                   select new
                                   {
                                       sc.Id,
                                       sc.ReferenceId,
                                       sc.ValidFrom,
                                       sc.ValidTo,
                                       sc.Type,
                                       sc.Active,
                                       sc.CreatedUser,
                                       sc.CreationDate,
                                       sc.CreatedBy,
                                       sc.CreatedOn,
                                       sc.ModifiedBy,
                                       sc.ModifiedOn,
                                       Attachments = (from dm in _dbContext.DocumentMaster
                                                      where dm.DocumentId == sc.Id.ToString() && dm.DocumentType == "SchemeDocuments"
                                                      select new
                                                      {
                                                          dm.Id,
                                                          SchemeId = dm.DocumentId,
                                                          dm.DocumentName,
                                                          dm.DocumentExtention,
                                                          dm.DocumentURL,
                                                          dm.DocumentType,
                                                          dm.CreatedOn,
                                                          dm.CreatedBy,
                                                          dm.ModifiedBy,
                                                          dm.ModifiedOn
                                                      }).ToList()

                                   }).ToListAsync();
                //return Ok(users);
                return Ok(new { success = "success", message = "You have successfully get user data", data = users });

            }
            catch (Exception ex)
            {
                return Ok(new { success = "error", message = ex.Message });
            }
        }



        [HttpPost("DeleteSchemeById")]
        public async Task<IActionResult> DeleteSchemeById(int Id, string? UserId)
        {
            try
            {
                var data = await _dbContext.Scheme.Where(x => x.Id == Id).FirstOrDefaultAsync();
                if (data == null)
                {
                    return Ok(new { success = false, message = "Details not found" });
                }
                _dbContext.Scheme.RemoveRange(data);
                var deletedocument = await _dbContext.DocumentMaster.Where(x => x.DocumentId == Id.ToString() && x.DocumentType == "SchemeDocuments").ToListAsync();
                if (deletedocument != null)
                {
                    foreach (var doc in deletedocument)
                    {
                        if (!string.IsNullOrEmpty(doc.DocumentPath) && System.IO.File.Exists(doc.DocumentPath))
                        {
                            System.IO.File.Delete(doc.DocumentPath);
                        }
                      Log.DataLog($"{UserId}",$"Document {doc.DocumentName} deleted Successfully by the User Id: {UserId}","Scheme");
                    }

                    _dbContext.DocumentMaster.RemoveRange(deletedocument);



                }
                await _dbContext.SaveChangesAsync();
                return Ok(new { success = true, message = "Scheme deleted successfully" });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message });
            }
        }
    }
}
