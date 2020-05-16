import React from "react";
import { withRouter } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  Button,
  ListGroup,
  ListGroupItem
} from "reactstrap";
import UserProfileForm from "./UserProfileForm";
import UserProfileReview from "../userProfileReviews/UserProfileReview";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import styles from "./userProfiles.module.css";
import * as userAuth from "../../services/userAuthService";
import * as profileService from "../../services/userProfilesService";
import * as profileReviewService from "../../services/userProfileReviewsService";
import logger from "sabio-debug";
import Grievance from "../grievances/Grievance";

const _logger = logger.extend("UserProfilePage");

class UserProfilePage extends React.Component {
  state = {
    defaultPic:
      "https://sabio-training.s3-us-west-2.amazonaws.com/HostAHero/1a4df426-b23d-4334-9ed5-70c76ef1af9c/defaultUserProfilePic.png",
    userProfile: {},
    isEdit: false,
    isCurrentViewing: false,
    isProfileLoading: true,
    editedInfo: {},
    areReviewsLoading: true,
    areMoreReviewsLoading: false,
    reviews: [],
    totalReviews: 0,
    reviewsPageIndex: 0,
    reviewsPageSize: 4,
    activeTab: "1",
    emailsToBeSent: []
  };

  yearJoined = utcDate => {
    let d = new Date(utcDate);
    let options = { year: "numeric" };
    let year = d.toLocaleDateString("en-US", options);
    return year;
  };

  editProfileBtn = () => {
    if (!this.state.isEdit) {
      return (
        <Button color="link" onClick={this.toggleEdit}>
          Edit Profile
        </Button>
      );
    }
  };

  toggleEdit = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    this.setState(prevState => {
      let isEdit = !prevState.isEdit;
      return { isEdit };
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  displayForm = () => {
    return (
      <UserProfileForm
        editProfile={this.state.userProfile}
        cancel={this.toggleEdit}
        submit={this.submitUpdate}
        removeAvatar={this.removeAvatar}
      />
    );
  };

  profileUpdater = updatedInfo => {
    this.setState(() => {
      const editedInfo = updatedInfo;
      return { editedInfo };
    });
    profileService
      .updateUserProfile(this.state.userProfile.id, updatedInfo)
      .then(this.onUpdateSuccess)
      .catch(this.onUpdateError);
  };

  removeAvatar = updatedInfo => {
    if (updatedInfo.avatarUrl !== this.state.defaultPic) {
      updatedInfo.avatarUrl = this.state.defaultPic;
      this.profileUpdater(updatedInfo);
    } else {
      toast("Sorry! You can't remove the default picture.");
    }
  };

  submitUpdate = updateInfo => {
    this.setState(() => {
      const editedInfo = updateInfo;
      return { editedInfo };
    });
    profileService
      .updateUserProfile(this.state.userProfile.id, updateInfo)
      .then(this.onUpdateSuccess)
      .catch(this.onUpdateError);
  };

  onUpdateSuccess = () => {
    toast("Profile successfully updated.");
    this.setState(prevState => {
      let userProfile = { ...prevState.userProfile };
      let editedInfo = { ...prevState.editedInfo };
      userProfile.firstName = editedInfo.firstName;
      userProfile.mi = editedInfo.mi;
      userProfile.lastName = editedInfo.lastName;
      userProfile.avatarUrl = editedInfo.avatarUrl;
      editedInfo = {};
      return { userProfile, editedInfo };
    });
    this.toggleEdit();
  };

  onUpdateError = err => {
    _logger(err);
    toast("Something went wrong! Please try again.");
    this.setState(() => {
      return { editedInfo: {} };
    });
  };

  getUserProfile = profileId => {
    profileService
      .getProfileByIdV2(profileId)
      .then(this.onGetUserProfileSuccess)
      .catch(this.onGetUserProfileError);
  };

  onGetUserProfileSuccess = response => {
    const userProfile = response.data.item;
    this.setState(() => {
      return {
        userProfile: userProfile,
        isProfileLoading: false
      };
    });
    this.getCurrentUser();
  };

  onGetUserProfileError = err => {
    _logger(err);
    toast("Something went wrong! Please try refreshing the page.");
  };

  getCurrentUser = () => {
    userAuth
      .getCurrent()
      .then(this.onGetCurrentSuccess)
      .catch(this.onGetCurrentError);
  };

  onGetCurrentSuccess = response => {
    if (response.data.item.id === this.state.userProfile.userId) {
      this.setState(() => {
        const isCurrentViewing = true;
        return { isCurrentViewing };
      });
    }
  };

  onGetCurrentError = err => {
    _logger("get current user error", err);
  };

  getReviews = (pageIndex, pageSize, profileId, onSuccess, onError) => {
    profileReviewService
      .getReviewsByProfileId(pageIndex, pageSize, profileId)
      .then(onSuccess)
      .catch(onError);
  };

  onGetReviewsSuccess = response => {
    _logger(response);
    const { item } = response.data;
    this.setState(() => {
      const reviews = item.pagedItems;
      const totalReviews = item.totalCount;
      const areReviewsLoading = false;
      const reviewsPageIndex = 1;
      return { reviews, totalReviews, areReviewsLoading, reviewsPageIndex };
    });
  };

  onGetReviewsError = err => {
    _logger(err);
    this.setState(() => {
      return { areReviewsLoading: false };
    });
  };

  mapReviews = () => {
    const { reviews } = this.state;
    if (this.state.reviews.length !== 0) {
      let arrayOfMappedReviews = reviews.map(this.mapSingleReview);
      return arrayOfMappedReviews;
    } else {
      return <h5>No Reviews Yet</h5>;
    }
  };

  mapSingleReview = singleReviewObj => {
    return (
      <UserProfileReview
        key={"reviewId_" + singleReviewObj.id}
        review={singleReviewObj}
        yearJoined={this.yearJoined}
      />
    );
  };

  onMoreReviewsClick = e => {
    const { id } = this.props.match.params;
    e.preventDefault();
    this.setState(() => {
      return { areMoreReviewsLoading: true };
    });
    this.getReviews(
      this.state.reviewsPageIndex,
      this.state.reviewsPageSize,
      id,
      this.onMoreReviewsSuccess,
      this.onMoreReviewsError
    );
  };

  onMoreReviewsSuccess = response => {
    _logger(response);
    this.setState(prevState => {
      const reviews = prevState.reviews.concat(response.data.item.pagedItems);
      const reviewsPageIndex = prevState.reviewsPageIndex + 1;
      const areMoreReviewsLoading = false;
      return { reviews, reviewsPageIndex, areMoreReviewsLoading };
    });
  };

  onMoreReviewsError = err => {
    _logger(err);
    toast("Something went wrong! Try refeshing the page.");
  };

  handleSrcError = () => {
    return this.state.defaultPic;
  };

  loadingSpinner = () => {
    return (
      <div className="loader-wrapper d-flex justify-content-center align-items-center">
        <div className="loader loader-undefined loader-active">
          <div className="loader-inner line-scale">
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </div>
    );
  };

  componentDidMount() {
    let { id } = this.props.match.params;
    this.getUserProfile(id);
    this.getReviews(
      this.state.reviewsPageIndex,
      this.state.reviewsPageSize,
      id,
      this.onGetReviewsSuccess,
      this.onGetReviewsError
    );
  }

  render() {
    _logger("profile page rendering");
    let { userProfile } = this.state;

    return (
      <Row>
        <Col sm={{ size: 4 }} className="mb-3">
          <Card className="card-border shadow">
            <div className={styles.flexAndCenter}>
              {this.state.isProfileLoading ? (
                this.loadingSpinner()
              ) : (
                <CardImg
                  className={styles.yourProfileImg}
                  src={userProfile.avatarUrl}
                  alt={userProfile.firstName + " " + userProfile.lastName}
                  onError={this.handleSrcError}
                />
              )}
            </div>
            <CardBody>
              <hr />
              <div>
                <p>
                  {this.state.totalReviews} Review
                  {this.state.totalReviews === 1 ? null : "s"}
                </p>
                <hr />
                <p>
                  {this.props.currentUser.membershipType === "Unverified"
                    ? "Unverified Veteran"
                    : this.props.currentUser.membershipType}
                </p>
              </div>
              <hr />
              <div>
                <h5>{userProfile.firstName} Has Provided</h5>
                {userProfile.avatarUrl !== this.state.defaultPic ? (
                  <p>
                    <i className="pe-7s-check avatar-icon-wrapper" /> Profile
                    Pic
                  </p>
                ) : null}
              </div>
              <Grievance props={this.props} />
            </CardBody>
          </Card>
        </Col>
        <Col sm={{ size: 8 }}>
          <Row>
            <Col className="mb-3">
              <Card body className="card-border shadow">
                {this.state.isProfileLoading ? (
                  <div className={styles.flexAndCenter}>
                    {this.loadingSpinner()}
                  </div>
                ) : (
                  <>
                    <h1>Hi! I&apos;m {userProfile.firstName}.</h1>

                    <h5>
                      I joined in {this.yearJoined(userProfile.dateCreated)}{" "}
                      {this.state.isCurrentViewing
                        ? this.editProfileBtn()
                        : null}
                    </h5>
                  </>
                )}
              </Card>
            </Col>
          </Row>

          {this.state.isEdit ? (
            <Row>
              <Col className="mb-3">{this.displayForm()}</Col>
            </Row>
          ) : null}

          <Row>
            <Col className="mb-3">
              <Card body className="card-border shadow">
                <h3>Reviews</h3>
                <ListGroup flush>
                  {this.state.areReviewsLoading
                    ? this.loadingSpinner()
                    : this.mapReviews()}
                  {this.state.reviews.length < this.state.totalReviews ? (
                    this.state.areMoreReviewsLoading ? (
                      <div className="d-flex justify-content-center">
                        {this.loadingSpinner()}
                      </div>
                    ) : (
                      <ListGroupItem className="d-flex justify-content-center">
                        <Button color="link" onClick={this.onMoreReviewsClick}>
                          Show more reviews
                        </Button>
                      </ListGroupItem>
                    )
                  ) : null}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

UserProfilePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  currentUser: PropTypes.shape({
    membershipType: PropTypes.string.isRequired
  })
};

export default withRouter(UserProfilePage);
