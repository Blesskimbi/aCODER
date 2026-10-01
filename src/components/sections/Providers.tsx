import Image from "next/image";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { CLOUD_PROVIDERS, LOCAL_PROVIDERS } from "@/content/product";
import { providerIcon } from "@/content/providerIcons";

function ProviderItem({ name }: { name: string }) {
  const icon = providerIcon(name);
  return (
    <span className="flex shrink-0 items-center gap-2.5 whitespace-nowrap">
      {icon && (
        <Image
          src={icon}
          alt=""
          width={22}
          height={22}
          className="h-[22px] w-[22px] rounded-[5px] object-contain opacity-80"
        />
      )}
      <span className="font-display text-[15px] font-light tracking-tight text-white/55">
        {name}
      </span>
    </span>
  );
}

export function ProviderMarquee() {
  const all = [...CLOUD_PROVIDERS, ...LOCAL_PROVIDERS];

  return (
    <section className="border-y border-white/[0.06] py-10">
      <Container>
        <Eyebrow>Works with the models you already pay for</Eyebrow>
      </Container>

      <div
        className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
        aria-hidden="true"
      >
        <div className="flex w-max animate-[marquee_44s_linear_infinite] gap-10 pr-10 motion-reduce:animate-none">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 gap-10">
              {all.map((p) => (
                <ProviderItem key={`${dup}-${p}`} name={p} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <Container className="mt-6">
        <p className="text-[13px] text-white/62">
          {CLOUD_PROVIDERS.length} cloud providers and {LOCAL_PROVIDERS.length}{" "}
          local options. Assign different models to different features.
        </p>
      </Container>
    </section>
  );
}
