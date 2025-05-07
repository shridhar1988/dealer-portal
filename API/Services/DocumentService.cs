using DealerPortal_API.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Ticketing_API.DbContexts;
using Ticketing_API.Services;

namespace DealerPortal_API.Services
{
    public class DocumentService
    {
        private readonly DealerPortalContext _dbContext;
        private readonly IConfiguration _configuration;
        private readonly AuthMasterSerices _authMasterService;
        private readonly int _tokenTimespan;

        public DocumentService(DealerPortalContext dbContext, IConfiguration configuration, AuthMasterSerices authMasterService)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            _authMasterService = authMasterService;
        }

        public async Task DocumentsUpload(Documentdto doc)

        {
            try
            {
                var allowedExtensions = new List<string>
                    {
                        ".pdf", ".jpg", ".jpeg", ".png"

                    };


                string fileSizeLimit = _configuration["VendorAttachmentSize"];



                for (int i = 0; i < doc.Documents.Count; i++)
                {
                    var document = doc.Documents[i];



                    {

                        if (document != null && document.Length > 0)
                        {
                            var documentName = document.FileName;
                            var documentName1 = Path.GetFileName(document.FileName);
                            var documentExtension = Path.GetExtension(document.FileName).ToLower();
                            var documentMimeType = document.ContentType;
                            if (document.Length > Convert.ToDecimal(fileSizeLimit))
                            {
                                throw new Exception("File Size Should be below 5MB");
                            }

                            if (allowedExtensions.Contains(documentExtension))
                            {
                                var url = _configuration["ApiURL"];

                                var documentPath = Path.Combine($"Documents/{doc.FolderName}/{doc.FolderName}_{doc.Id}_Documents", documentName1);
                                if (!Directory.Exists(Path.GetDirectoryName(documentPath)))
                                {
                                    Directory.CreateDirectory(Path.GetDirectoryName(documentPath));
                                }

                                using (var stream = new FileStream(documentPath, FileMode.Create))
                                {
                                    await document.CopyToAsync(stream);
                                }

                                var newDocument = new DocumentMaster
                                {
                                    DocumentType = doc.documentType,
                                    DocumentId = doc.Id,
                                    DocumentName = documentName,
                                    DocumentExtention = documentExtension,
                                    DocumentURL = url + documentPath,
                                    DocumentPath = documentPath,
                                    CreatedOn = DateTime.Now,
                                    CreatedBy = doc.UserID
                                };

                                _dbContext.DocumentMaster.Add(newDocument);


                                await _dbContext.SaveChangesAsync();
                               Log.DataLog($"{doc.UserID}",$"Document {documentName} Successfully Uploaded for the {doc.documentType}  id {doc.Id}","Scheme");


                            }
                            else
                            {
                                throw new Exception("Invalid file type. Only PDF,documents,Excel and image files (JPG,PNG,Pdf,doc,docx,xls,xlsx etc.) are allowed.");
                            }
                        }
                    }
                }



            }
            catch (Exception ex)
            {
                throw new Exception($"{ex.Message}");
            }
        }
    }
}
