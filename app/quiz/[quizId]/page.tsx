// quiz/[quizId]/page.tsx
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  params: {
    courseId: string;
    quizId: string;
  };
}

const QuizPage = async ({ params }: QuizProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const quiz = await db.quiz.findUnique({
    where: {
      id: params.quizId,
      courseId: params.courseId,
    },
    include: {
      questions: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!quiz) {
    return redirect(`/courses/${params.courseId}`);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <QuizContent quiz={quiz} userId={userId} />
        </CardContent>
      </Card>
    </div>
  );
};

const QuizContent = ({ quiz, userId }: { quiz: any; userId: string }) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = async () => {
    const correctAnswers = quiz.questions.reduce((count: number, question: any) => {
      return count + (answers[question.id] === question.correctAnswer ? 1 : 0);
    }, 0);

    const finalScore = (correctAnswers / quiz.questions.length) * 100;
    setScore(finalScore);
    setSubmitted(true);

    // Save quiz progress to database
    await db.quizProgress.create({
      data: {
        userId,
        quizId: quiz.id,
        score: finalScore,
        completed: true,
      },
    });
  };

  return (
    <div className="space-y-8">
      {quiz.questions.map((question: QuizQuestion, index: number) => (
        <div key={question.id} className="space-y-4">
          <h3 className="font-medium text-lg">
            {index + 1}. {question.question}
          </h3>
          <RadioGroup
            value={answers[question.id]?.toString()}
            onValueChange={(value) => {
              if (!submitted) {
                setAnswers((prev) => ({
                  ...prev,
                  [question.id]: parseInt(value),
                }));
              }
            }}
            className="space-y-2"
            disabled={submitted}
          >
            {question.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className={`flex items-center space-x-2 p-2 rounded ${
                  submitted
                    ? optionIndex === question.correctAnswer
                      ? "bg-green-100"
                      : answers[question.id] === optionIndex
                      ? "bg-red-100"
                      : ""
                    : ""
                }`}
              >
                <RadioGroupItem value={optionIndex.toString()} id={`q${question.id}-${optionIndex}`} />
                <label
                  htmlFor={`q${question.id}-${optionIndex}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}

      <div className="flex flex-col items-center gap-4 mt-8">
        {submitted ? (
          <div className="text-center">
            <p className="text-xl font-semibold mb-2">Your Score: {score.toFixed(1)}%</p>
            <p className="text-muted-foreground">
              {score >= 70 ? "Congratulations! You passed the quiz!" : "Keep practicing and try again!"}
            </p>
          </div>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== quiz.questions.length}
            className="w-full md:w-auto"
          >
            Submit Quiz
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;