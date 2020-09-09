// TODO: fix this and implement before apollo 4.
export function afterFirstPagination(keyArgs=false) {
    return {
        keyArgs,
        merge(existing, incoming, {args}) {
            const merged = existing ? existing.slice(0) : [];
            console.log(merged)
            const after = args ? args.after : merged.length;
            console.log(args)
            console.log(after)
            const end = after + incoming.length;
            for(let i = after; i < end; ++i) {
                merged[i] = incoming[i - after];
            }
            return merged;
        },

        read(existing, {args, variables}) {
            console.log(variables)

            const page = existing && existing.slice(
                args.after,
                args.after + args.first
            )

            if (page && page.length > 0) {
                return page
            }
        }
    };
}