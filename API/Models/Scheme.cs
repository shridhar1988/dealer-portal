using System.ComponentModel.DataAnnotations;
using System.Data.SqlTypes;
using Ticketing_API.Models;

namespace DealerPortal_API.Models
{
    public class Scheme
    {
        [Key]
        public int Id { get; set; }
    
        public string? ReferenceId { get; set; }
        
        public string? ValidFrom { get; set; }
        public string? CreatedUser { get; set; }
        public string? ValidTo { get; set; }
        public string? CreationDate { get; set; }
        public string? Type { get; set; }

        public bool? Active { get; set; }
    
       
        public DateTime CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }
    }

    public class Schemedto
    {
        [Key]
        public int Id { get; set; }

        public string? ReferenceId { get; set; }

        public string? ValidFrom { get; set; }
        public string? CreatedUser { get; set; }
        public string? UserId { get; set; }
        public string? ValidTo { get; set; }
        public string? CreationDate { get; set; }
        public string? Type { get; set; }

        public bool? Active { get; set; }


        public List<IFormFile>? Documents {get;set;}
    }
    public class DocumentMaster
    {
        [Key]

        public int Id { get; set; }
        public string? DocumentId { get; set; }
        public string? DocumentType { get; set; }

        public string? DocumentExtention { get; set; }
        public string? DocumentName { get; set; }
        public string? DocumentPath { get; set; }
        public string? DocumentURL { get; set; }
        public int? DocumentNameId { get; set; }
        public string? DocumentXeroxOrOriginal { get; set; }

        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }

    }
    public class Documentdto
    {
        public string? Id { get; set; }
        public List<IFormFile>? Documents { get; set; }
        public string? documentType { get; set; }
        public string? FolderName { get; set; }
        public string? UserID { get; set; }
    }
}
