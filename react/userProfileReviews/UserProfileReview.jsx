import React from "react";
import PropTypes from "prop-types";
import { ListGroupItem, Row, Col } from "reactstrap";
import { IoIosStar } from "react-icons/io";
import styles from "./userProfileReviews.module.css";

class UserProfileReview extends React.Component {
  reviewDate = () => {
    let d = new Date(this.props.review.dateModified);
    let options = { month: "long", year: "numeric" };
    let displayDate = d.toLocaleDateString("en-US", options);
    return displayDate;
  };

  render() {
    const { review } = this.props;

    return (
      <ListGroupItem className={styles.listGroupItem}>
        <div className={styles.reviewDateAndRating}>
          {this.reviewDate()}
          {"   "}
          <IoIosStar className="ml-2 mb-1" color="orange" />
          {review.rating}
        </div>
        <div>{review.description}</div>
        <Row className="mt-2">
          <Col sm="1">
            <a
              href={`/user/profile/${review.reviewerProfileId}`}
              rel="noopener noreferrer"
              target="_blank"
              className="mt-1"
            >
              <img
                src={review.reviewerPic}
                alt={`${review.reviewerFName}'s Avatar`}
                className={styles.reviewerImg}
              />
            </a>
          </Col>
          <Col sm="11">
            <div className={styles.reviewerName}>
              Reviewed by {review.reviewerFName}
            </div>
            <span className={styles.reviewerJoinYear}>
              Joined in {this.props.yearJoined(review.reviewerJoinDate)}
            </span>
          </Col>
        </Row>
      </ListGroupItem>
    );
  }
}

UserProfileReview.propTypes = {
  review: PropTypes.shape({
    id: PropTypes.number,
    createdBy: PropTypes.number,
    userProfileId: PropTypes.number,
    description: PropTypes.string,
    rating: PropTypes.number,
    dateCreated: PropTypes.string,
    dateModified: PropTypes.string,
    reviewerProfileId: PropTypes.number,
    reviewerFName: PropTypes.string,
    reviewerJoinDate: PropTypes.string,
    reviewerPic: PropTypes.string
  }).isRequired,
  yearJoined: PropTypes.func.isRequired
};

export default UserProfileReview;
