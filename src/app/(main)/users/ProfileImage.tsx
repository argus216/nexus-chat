type ProfileImageProps = {
    name: string;
};

export default function ProfileImage({ name }: ProfileImageProps) {
    const displayName = name
        .split(" ")
        .map((w) => w[0].toUpperCase())
        .join("");

    return <div></div>;
}
