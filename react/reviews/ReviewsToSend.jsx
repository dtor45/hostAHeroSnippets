import React from "react";
import { Row, Col, Card, Button, ListGroup, ListGroupItem } from "reactstrap";
import ReviewByReservation from "./ReviewByReservation";
import * as emailService from "../../services/emailService";
import * as resService from "../../services/reservationService";
import PropTypes from "prop-types";
import logger from "sabio-debug";

const _logger = logger.extend("UserProfileTesterPage");

class ReviewsToSend extends React.Component {
  state = {
    resInfo: [],
    pageIndex: 0,
    pageSize: 10,
    isLoading: true,
    areNoResFound: false
  };

  getCheckedOutListingForReviews = (pageIndex, pageSize, hostUserId) => {
    this.setState(() => {
      return { isLoading: true };
    });
    resService
      .checkIfEmailSent(pageIndex, pageSize, hostUserId)
      .then(this.onGetSuccess)
      .catch(this.onGetError);
  };

  onGetSuccess = response => {
    const resInfo = response.data.item.pagedItems;
    this.setState(() => {
      return { resInfo, areNoResFound: false, isLoading: false };
    });
  };

  onGetError = err => {
    if (err.response.status === 404) {
      this.setState(() => {
        return { areNoResFound: true, isLoading: false };
      });
    } else {
      _logger(err);
    }
  };

  populateReviewItems = () => {
    let arrayOfItems = this.state.resInfo.slice(0).map(this.mapper);

    return arrayOfItems;
  };

  mapper = resObj => {
    return (
      <ReviewByReservation
        key={"UniqueKey_" + resObj.reservationId}
        resInfo={resObj}
        sendSingleEmail={this.sendEmailCall}
      />
    );
  };

  sendEmailToAll = () => {
    const { resInfo } = this.state;

    for (let singleInfoObj of resInfo) {
      const payload = {
        guestEmail: singleInfoObj.guestEmail,
        hostName: singleInfoObj.hostFName || "null",
        guestName: singleInfoObj.guestFName || "null",
        listingName: singleInfoObj.listingName,
        listingId: singleInfoObj.listingId,
        hostProfileId: singleInfoObj.hostProfileId,
        reservationId: singleInfoObj.reservationId
      };
      this.sendEmailCall(payload, singleInfoObj.reservationId);
    }
  };

  sendEmailCall = (payload, resId) => {
    emailService
      .reviewEmail(payload)
      .then(() => this.onSendEmailSuccess(resId))
      .catch(this.onSendEmailError);
  };

  onSendEmailSuccess = resId => {
    this.updateEmailSentCheck(resId, true);
  };

  onSendEmailError = err => {
    _logger(err);
  };

  updateEmailSentCheck = (resId, guestEmailSent) => {
    resService
      .updateIfGuestEmailSent(resId, guestEmailSent)
      .then(() => this.updateEmailSentSuccess(resId))
      .catch(this.updateEmailSentError);
  };

  updateEmailSentSuccess = resId => {
    this.setState(prevState => {
      let resInfo = [...prevState.resInfo];
      resInfo = resInfo.filter(singleRes => {
        return singleRes.reservationId !== resId;
      });
      return { resInfo };
    });
  };

  updatedEmailSentError = err => {
    _logger(err);
  };

  refreshList = e => {
    e.preventDefault();
    this.getCheckedOutListingForReviews(
      this.state.pageIndex,
      this.state.pageSize,
      this.props.hostUserId
    );
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
    this.getCheckedOutListingForReviews(
      this.state.pageIndex,
      this.state.pageSize,
      this.props.hostUserId
    );
  }

  render() {
    return (
      <Row className="d-flex justify-content-center">
        <Col sm={8}>
          <Card body>
            <ListGroup flush>
              {this.state.isLoading ? (
                <div className="d-flex justify-content-center">
                  {this.loadingSpinner()}
                </div>
              ) : this.state.areNoResFound ? (
                <ListGroupItem className="d-flex justify-content-center">
                  <h6>No Emails to be Sent</h6>
                </ListGroupItem>
              ) : (
                this.populateReviewItems()
              )}
            </ListGroup>
            <div className="d-flex justify-content-around mt-3">
              <Button onClick={this.sendEmailToAll}>Send Email To All</Button>
              <Button onClick={this.refreshList}>Refresh List</Button>
            </div>
          </Card>
        </Col>
      </Row>
    );
  }
}

ReviewsToSend.propTypes = {
  hostUserId: PropTypes.number.isRequired
};

export default ReviewsToSend;
