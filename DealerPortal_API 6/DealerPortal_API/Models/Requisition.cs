using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DealerPortal_API.Models
{
    public class Requisition
    {
        [Key]
   
        public int Id { get; set; }
        public string? RetailerId { get; set; }
        public bool? RequisitionStatus { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }
    }
   
    public class MaterialMaster
    {
        [Key]

        public int Id { get; set; }
        public string? MaterialCode { get; set; }
        public string? MaterialName { get; set; }
      
        public bool? IsActive { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }
    }
    public class RequisitionMaterials
    {
        public int Id { get; set; }
        public int? RequisitionId { get; set; }
        public string? MaterialCode { get; set; }

        public string? MaterialName { get; set; }

        public string? OrderQuantiy { get; set; }

        public string? UOM { get; set; }

        public string? ExpectedBy { get; set; }
        public bool? Status { get; set; }

        public bool? IsActive { get; set; }

        public DateTime? CreatedOn { get; set; }

        public string? CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public string? ModifiedBy { get; set; }
    }
    public class RequisitionMaterialsdto
    {
        public int? Id { get; set; }
        public int? RequisitionId { get; set; }
        public string? MaterialCode { get; set; }

        public string? MaterialName { get; set; }

        public string? OrderQuantiy { get; set; }

        public string? UOM { get; set; }

        public string? ExpectedBy { get; set; }
        public bool? Status { get; set; }


    }
    public class Requisitiondto
    {
        [Key]

        public int Id { get; set; }
        public string? RetailerId { get; set; }
      
        public bool? IsActive { get; set; }
        public List<RequisitionMaterialsdto>? Materials { get; set; }
        public string? UserId { get; set; }
    
    }
    public class Requisitiondto1
    {
        [Key]

        public int Id { get; set; }
        public string? RetailerId { get; set; }

        public string? RequestedBy { get; set; }
        public string? RetailerName { get; set; }
        public bool? RequisitionStatus { get; set; }
        public bool? IsActive { get; set; }
        public List<RequisitionMaterialsdto>? Materials { get; set; }
        public string? UserId { get; set; }

    }
    public class MaterialDto 
    {
        [Key]

        public int Id { get; set; }
        public string? MaterialCode { get; set; }
        public string? MaterialName { get; set; }

        public bool? IsActive { get; set; }
        public string? CreatedBy { get; set; }
    }
}
