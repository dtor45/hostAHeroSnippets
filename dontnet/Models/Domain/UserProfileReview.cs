using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class UserProfileReview
    {
        public int Id { get; set; }

        public int CreatedBy { get; set; }

        public int UserProfileId { get; set; }

        public string Description { get; set; }

        public float Rating { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }

        public int ReviewerProfileId { get; set; }

        public string ReviewerFName { get; set; }

        public DateTime ReviewerJoinDate { get; set; }

        public string ReviewerPic { get; set; }
    }
}
