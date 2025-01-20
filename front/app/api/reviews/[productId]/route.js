import { NextResponse } from "next/server";
import { Review } from "@/models/Review";
import { mongooseConnect } from "../../../lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function POST(request, context) {
  console.log("Start obsługi żądania POST dla recenzji");
  try {
    console.log("Próba połączenia z MongoDB...");
    await mongooseConnect();
    console.log("Połączenie z MongoDB ustanowione");

    console.log("Sprawdzanie sesji użytkownika...");
    const session = await getServerSession(authOptions);
    console.log("Dane sesji:", JSON.stringify(session, null, 2));

    if (!session?.user?.email) {
      console.log("Brak zalogowanego użytkownika lub emaila");
      return NextResponse.json(
        { error: "Musisz być zalogowany" },
        { status: 401 }
      );
    }

    const productId = context.params.productId;
    console.log("ID produktu:", productId);

    const data = await request.json();
    console.log("Otrzymane dane:", data);

    const { rating, comment } = data;

    if (!rating || !comment) {
      console.log("Brak wymaganych pól");
      return NextResponse.json(
        { error: "Ocena i komentarz są wymagane" },
        { status: 400 }
      );
    }

    console.log("Sprawdzanie istniejących recenzji...");
    const existingReview = await Review.findOne({
      product: new mongoose.Types.ObjectId(productId),
      userEmail: session.user.email,
    });

    if (existingReview) {
      console.log("Znaleziono istniejącą recenzję");
      return NextResponse.json(
        { error: "Już dodałeś recenzję do tego produktu" },
        { status: 400 }
      );
    }

    console.log("Próba utworzenia nowej recenzji z danymi:", {
      product: productId,
      userEmail: session.user.email,
      userName: session.user.email,
      rating: Number(rating),
      comment,
    });

    const review = await Review.create({
      product: new mongoose.Types.ObjectId(productId),
      userEmail: session.user.email,
      userName: session.user.email,
      rating: Number(rating),
      comment,
    });

    console.log("Recenzja utworzona pomyślnie:", review);

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Szczegóły błędu:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        {
          error: "Nieprawidłowe dane recenzji",
          details: error.message,
          validationErrors: Object.keys(error.errors).map((key) => ({
            field: key,
            message: error.errors[key].message,
          })),
        },
        { status: 400 }
      );
    }

    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json(
        { error: "Nieprawidłowy format ID", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Błąd serwera przy dodawaniu recenzji",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(request, context) {
  try {
    await mongooseConnect();
    const productId = context.params.productId;

    const reviews = await Review.find({
      product: new mongoose.Types.ObjectId(productId),
    }).sort({ createdAt: -1 });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length
        : 0;

    return NextResponse.json({
      averageRating,
      reviews,
    });
  } catch (error) {
    console.error("Błąd podczas pobierania recenzji:", error);
    return NextResponse.json(
      { error: "Błąd serwera przy pobieraniu recenzji" },
      { status: 500 }
    );
  }
}
