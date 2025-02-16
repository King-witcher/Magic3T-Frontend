interface Props {}

export function Spinner() {
  return (
    <img
      className="size-[80px] animate-spin duration-100"
      src={`${import.meta.env.VITE_CDN_URL}/ui/spinner.png`}
      alt="spinner"
    />
  )
}
