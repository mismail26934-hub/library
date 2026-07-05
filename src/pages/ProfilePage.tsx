import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProfile, useUpdateProfile } from "@/features/profile/useProfile";
import { ProfileTabs } from "@/components/ProfileTabs";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingSpinner, ErrorState } from "@/components/states";
import { getInitials } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().optional(),
  profilePhoto: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export function ProfilePage() {
  const { data, isLoading, isError, refetch } = useProfile();
  const update = useUpdateProfile();
  const [editOpen, setEditOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (data) {
      reset({
        name: data.profile.name,
        phone: data.profile.phone ?? "",
        profilePhoto: data.profile.profilePhoto ?? "",
      });
    }
  }, [data, reset]);

  if (isLoading) return <LoadingSpinner label="Loading profile..." />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  const { profile } = data;

  const onSubmit = handleSubmit((v) =>
    update.mutate(
      {
        name: v.name,
        phone: v.phone || undefined,
        profilePhoto: v.profilePhoto || undefined,
      },
      { onSuccess: () => setEditOpen(false) },
    ),
  );

  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col gap-4 md:gap-6">
      <ProfileTabs />

      <div className="flex flex-col gap-4 md:gap-6">
        <h1 className="text-2xl font-bold tracking-[-0.72px] text-[var(--color-ink)] md:text-[28px] md:tracking-[-0.84px]">
          Profile
        </h1>

        <div className="shadow-card flex flex-col gap-4 rounded-2xl bg-white p-4 md:gap-6 md:p-5">
          <div className="flex flex-col gap-2 md:gap-3">
            <Avatar
              className="size-16"
              src={profile.profilePhoto}
              fallback={getInitials(profile.name)}
            />
            <InfoRow label="Name" value={profile.name} />
            <InfoRow label="Email" value={profile.email} />
            <InfoRow label="Nomor Handphone" value={profile.phone || "-"} />
          </div>

          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="flex h-11 w-full items-center justify-center rounded-full bg-[#1c65da] text-base font-bold tracking-[-0.32px] text-white transition-colors hover:bg-[#1c65da]/90"
          >
            Update Profile
          </button>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent onClose={() => setEditOpen(false)}>
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Nomor Handphone</Label>
              <Input id="phone" placeholder="+62..." {...register("phone")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="profilePhoto">Profile photo URL</Label>
              <Input
                id="profilePhoto"
                placeholder="https://..."
                {...register("profilePhoto")}
              />
              {errors.profilePhoto && (
                <p className="text-xs text-destructive">
                  {errors.profilePhoto.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              loading={update.isPending}
              className="h-11 w-full rounded-full text-base font-bold"
            >
              Save changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm text-[var(--color-ink)] md:text-base">
      <span className="shrink-0 font-medium tracking-[-0.42px] md:tracking-[-0.48px]">
        {label}
      </span>
      <span className="truncate text-right font-bold tracking-[-0.28px] md:tracking-[-0.32px]">
        {value}
      </span>
    </div>
  );
}
