using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sabio.Models.Requests.UserProfileReviews
{
    public class UserProfileReviewAddRequest
    {
        [Required]
        public int UserProfileId { get; set; }

        [Required]
        [StringLength(4000, MinimumLength = 10)]
        public string Description { get; set; }

        [Required]
        [Range(1, 5)]
        public float Rating { get; set; }
    }
}
