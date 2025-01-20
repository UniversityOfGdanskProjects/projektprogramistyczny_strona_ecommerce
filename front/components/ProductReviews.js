import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ReviewsSection = styled.div`
  margin: 40px 0;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: normal;
  margin: 30px 0 20px;
`;

const ReviewsContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
`;

const RatingBox = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
`;

const StarIcon = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: ${(props) => (props.$clickable ? "pointer" : "default")};
  color: ${(props) => (props.$filled ? "#ffd700" : "#e4e4e4")};
  font-size: ${(props) => props.$size || "24px"};

  &:hover {
    color: ${(props) =>
      props.$clickable ? "#ffd700" : props.$filled ? "#ffd700" : "#e4e4e4"};
  }
`;

const ReviewForm = styled.form`
  margin: 20px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  min-height: 100px;
  font-family: inherit;
  &:focus {
    outline: none;
    border-color: #5542f6;
  }
`;

const Button = styled.button`
  background-color: #5542f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #1100af;
  }
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const AverageRating = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 10px;
`;

const ReviewItem = styled.div`
  border-bottom: 1px solid #eee;
  padding: 15px 0;
  &:last-child {
    border-bottom: none;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #666;
`;

const ReviewContent = styled.p`
  margin: 10px 0;
  line-height: 1.5;
`;

const NoReviews = styled.p`
  text-align: center;
  color: #666;
  padding: 20px;
`;

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    checkAuthStatus();
    fetchReviews();
  }, [productId]);

  async function checkAuthStatus() {
    try {
      const response = await fetch("/api/auth/session");
      const session = await response.json();
      setIsLoggedIn(!!session?.user);
    } catch (err) {
      console.error("Error checking auth status:", err);
      setIsLoggedIn(false);
    }
  }

  async function fetchReviews() {
    try {
      const response = await fetch(`/api/reviews/${productId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setErrorMessage(
        "Nie udało się załadować opinii. Spróbuj ponownie później."
      );
    }
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    setErrorMessage("");

    if (!isLoggedIn) {
      setErrorMessage("Musisz być zalogowany, aby dodać opinię");
      return;
    }

    if (rating === 0) {
      setErrorMessage("Proszę wybrać ocenę");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/reviews/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Wystąpił błąd podczas dodawania opinii");
      }

      setRating(0);
      setComment("");
      await fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrorMessage(
        error.message || "Wystąpił błąd podczas dodawania opinii"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ReviewsSection>
      <Title>Opinie klientów</Title>
      <ReviewsContainer>
        {errorMessage && (
          <div
            style={{
              color: "red",
              marginBottom: "15px",
              padding: "10px",
              backgroundColor: "#fff5f5",
              borderRadius: "5px",
            }}
          >
            {errorMessage}
          </div>
        )}

        <AverageRating>
          <RatingBox>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                $filled={star <= Math.round(averageRating)}
                type="button"
              >
                ★
              </StarIcon>
            ))}
          </RatingBox>
          <span>Średnia ocena: {averageRating.toFixed(1)} / 5</span>
        </AverageRating>

        {isLoggedIn ? (
          <ReviewForm onSubmit={handleSubmitReview}>
            <h3>Dodaj opinię</h3>
            <RatingBox>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  $filled={star <= rating}
                  $clickable
                  type="button"
                  onClick={() => setRating(star)}
                >
                  ★
                </StarIcon>
              ))}
            </RatingBox>
            <TextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Napisz swoją opinię..."
              required
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Wysyłanie..." : "Dodaj opinię"}
            </Button>
          </ReviewForm>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              backgroundColor: "#f8f9fa",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          >
            Zaloguj się, aby dodać opinię
          </div>
        )}

        <div>
          {reviews.length === 0 ? (
            <NoReviews>
              Ten produkt nie ma jeszcze żadnych opinii. Bądź pierwszy!
            </NoReviews>
          ) : (
            reviews.map((review) => (
              <ReviewItem key={review._id}>
                <ReviewHeader>
                  <span>{review.userName}</span>
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                </ReviewHeader>
                <RatingBox>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      $filled={star <= review.rating}
                      $size="16px"
                    >
                      ★
                    </StarIcon>
                  ))}
                </RatingBox>
                <ReviewContent>{review.comment}</ReviewContent>
              </ReviewItem>
            ))
          )}
        </div>
      </ReviewsContainer>
    </ReviewsSection>
  );
}
