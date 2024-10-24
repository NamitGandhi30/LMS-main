'use client'

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";

import { useGetCallById } from "@/hooks/useGetCallById";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clipboard, Video } from "lucide-react";

const Table = ({
    title,
    description,
}: {
    title: string;
    description: string;
}) => {
    return (
        <div className="flex flex-col items-start gap-2 xl:flex-row xl:items-center">
            <h2 className="text-base font-medium text-blue-200 lg:text-lg xl:min-w-32">
                {title}:
            </h2>
            <p className="truncate text-sm font-bold text-black max-sm:max-w-[320px] lg:text-lg">
                {description}
            </p>
        </div>
    );
};

const PersonalRoom = () => {
    const router = useRouter();
    const { user } = useUser();
    const client = useStreamVideoClient();
    const meetingId = user?.id;
    const { toast } = useToast();

    const { call } = useGetCallById(meetingId!);

    const startRoom = async () => {
        if (!client || !user) {
            router.push(`/dashboard`);
            return;
        }

        const newCall = client.call("default", meetingId!);

        if (!call) {
            await newCall.getOrCreate({
                data: {
                    starts_at: new Date().toISOString(),
                },
            });
        }

        router.push(`/meeting/${meetingId}?personal=true`);
    };

    const meetingLink = `${process.env.NEXT_PUBLIC_APP_URL}/meeting/${meetingId}?personal=true`;

    return (
        <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-900 to-blue-700 text-white shadow-xl">
            <CardHeader className="border-b border-blue-600 pb-6">
                <CardTitle className="text-2xl font-bold lg:text-3xl">Personal Meeting Room</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
                    <Table title="Topic" description={`${user?.username}'s Meeting Room`} />
                    <Table title="Meeting ID" description={meetingId!} />
                    <Table title="Invite Link" description={meetingLink} />
                </div>
                <div className="flex gap-5 mt-10">
                    <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={startRoom}
                    >
                        <Video className="w-4 h-4 mr-2" />
                        Start Meeting
                    </Button>
                    <Button
                        variant="outline"
                        className="bg-blue-800 hover:bg-blue-700 text-white border-blue-500"
                        onClick={() => {
                            navigator.clipboard.writeText(meetingLink);
                            toast({
                                title: "Link Copied",
                                description: "Meeting invitation link has been copied to clipboard.",
                            });
                        }}
                    >
                        <Clipboard className="w-4 h-4 mr-2" />
                        Copy Invitation
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default PersonalRoom;