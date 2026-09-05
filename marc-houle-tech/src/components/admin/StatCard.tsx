type Props = {
  title: string;
  value: number | string;
  description?: string;
  icon?: string;
};

export default function StatCard({
  title,
  value,
  description,
  icon,
}: Props) {
  return (
    <article className="rounded-[22px] border border-[#113b5e]/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,38,70,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#677789]">
            {title}
          </p>

          <div className="mt-3 text-3xl font-black tracking-tight text-[#032f55]">
            {value}
          </div>

          {description && (
            <p className="mt-2 text-xs leading-5 text-[#677789]">
              {description}
            </p>
          )}
        </div>

        {icon && (
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[15px] bg-[#eaf5ff] text-xl">
            {icon}
          </div>
        )}
      </div>
    </article>
  );
}