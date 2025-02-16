interface Props {
  className?: string
}

export function Spinner({ className }: Props) {
  return (
    <div className={className}>
      <img
        className="size-full animate-spin duration-100 mix-blend-lighten"
        src={`${import.meta.env.VITE_CDN_URL}/ui/spinner.png`}
        alt="spinner"
      />
    </div>
  )
}
