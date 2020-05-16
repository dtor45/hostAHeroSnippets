using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.UserProfileReviews;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class UserProfileReviewService : IUserProfileReviewService
    {
        IDataProvider _data = null;

        public UserProfileReviewService(IDataProvider data)
        {
            _data = data;
        }

        public int Add(UserProfileReviewAddRequest model, int userId)
        {
            int id = 0;

            string procName = "dbo.UserProfileReviews_Insert";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                AddCommonParams(model, paramCol);
                paramCol.AddWithValue("@UserProfileId", model.UserProfileId);
                paramCol.AddWithValue("@CreatedBy", userId);

                SqlParameter idOutput = new SqlParameter("@Id", SqlDbType.Int);
                idOutput.Direction = ParameterDirection.Output;

                paramCol.Add(idOutput);
            }, returnParameters: delegate (SqlParameterCollection returnCol)
            {
                object outputId = returnCol["@Id"].Value;

                int.TryParse(outputId.ToString(), out id);
            });

            return id;
        }        

        public void Delete(int id)
        {
            string procName = "dbo.UserProfileReviews_Delete_ById";

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@Id", id);
            }, returnParameters: null);
        }

        public void Update(UserProfileReviewUpdateRequest model)
        {
            string procName = "dbo.UserProfileReviews_Update";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                AddCommonParams(model, paramCol);

                paramCol.AddWithValue("@Id", model.Id);
            }, returnParameters: null);
        }

        public Paged<UserProfileReview> GetByCreatedBy(int userId, int pageIndex, int pageSize)
        {
            Paged<UserProfileReview> pagedList = null;

            List<UserProfileReview> list = null;

            UserProfileReview aUserProfileReview = null;

            int totalCount = 0;

            string procName = "dbo.UserProfileReviews_Select_ByCreatedBy_V2";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@PageIndex", pageIndex);
                paramCol.AddWithValue("@PageSize", pageSize);
                paramCol.AddWithValue("@CreatedBy", userId);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                aUserProfileReview = MapSingleReview(reader);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(7);
                }

                if (list == null)
                {
                    list = new List<UserProfileReview>();
                }

                list.Add(aUserProfileReview);
            });

            if (list != null)
            {
                pagedList = new Paged<UserProfileReview>(list, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public Paged<UserProfileReview> GetByUserProfileId(int userProfileId, int pageIndex, int pageSize)
        {
            Paged<UserProfileReview> pagedList = null;

            List<UserProfileReview> list = null;

            UserProfileReview aUserProfileReview = null;

            int totalCount = 0;

            string procName = "dbo.UserProfileReviews_Select_ByUserProfileId_V3";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@PageIndex", pageIndex);
                paramCol.AddWithValue("@PageSize", pageSize);
                paramCol.AddWithValue("@UserProfileId", userProfileId);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                aUserProfileReview = MapReviewByUserProfileId(reader);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(11);
                }

                if (list == null)
                {
                    list = new List<UserProfileReview>();
                }

                list.Add(aUserProfileReview);
            });

            if (list != null)
            {
                pagedList = new Paged<UserProfileReview>(list, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        private static UserProfileReview MapSingleReview(IDataReader reader)
        {
            UserProfileReview userProfileReview = new UserProfileReview();

            int initialIndex = 0;

            userProfileReview.Id = reader.GetSafeInt32(initialIndex++);
            userProfileReview.CreatedBy = reader.GetSafeInt32(initialIndex++);
            userProfileReview.UserProfileId = reader.GetSafeInt32(initialIndex++);
            userProfileReview.Description = reader.GetSafeString(initialIndex++);
            userProfileReview.Rating = Convert.ToSingle(reader.GetSafeDecimal(initialIndex++));
            userProfileReview.DateCreated = reader.GetSafeDateTime(initialIndex++);
            userProfileReview.DateModified = reader.GetSafeDateTime(initialIndex++);

            return userProfileReview;
        }

        private static UserProfileReview MapReviewByUserProfileId(IDataReader reader)
        {
            UserProfileReview userProfileReview = new UserProfileReview();

            int initialIndex = 0;

            userProfileReview.Id = reader.GetSafeInt32(initialIndex++);
            userProfileReview.CreatedBy = reader.GetSafeInt32(initialIndex++);
            userProfileReview.UserProfileId = reader.GetSafeInt32(initialIndex++);
            userProfileReview.Description = reader.GetSafeString(initialIndex++);
            userProfileReview.Rating = Convert.ToSingle(reader.GetSafeDecimal(initialIndex++));
            userProfileReview.DateCreated = reader.GetSafeDateTime(initialIndex++);
            userProfileReview.DateModified = reader.GetSafeDateTime(initialIndex++);
            userProfileReview.ReviewerProfileId = reader.GetSafeInt32(initialIndex++);
            userProfileReview.ReviewerFName = reader.GetSafeString(initialIndex++);
            userProfileReview.ReviewerJoinDate = reader.GetSafeDateTime(initialIndex++);
            userProfileReview.ReviewerPic = reader.GetSafeString(initialIndex++);

            return userProfileReview;
        }

        private static void AddCommonParams(UserProfileReviewAddRequest model, SqlParameterCollection paramCol)
        {
            paramCol.AddWithValue("@Description", model.Description);
            paramCol.AddWithValue("@Rating", model.Rating);
        }

    }
}
