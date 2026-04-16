using System;

namespace Backend.Models
{
    public class UserBehavior
    {
        public int Id { get; set; }               
        
        public int UserId { get; set; }           
        public User User { get; set; } = default!;            
        
        public int ProductId { get; set; }        
        public Product Product { get; set; } = default!;      
        
        public string ActionType { get; set; } = string.Empty;    
        
        public DateTime ActionDate { get; set; }  
    }
}
