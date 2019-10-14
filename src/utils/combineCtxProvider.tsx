import React, { PropsWithChildren, FC } from "react";

const combineCtxProvider = (providers: FC<PropsWithChildren<{}>>[]) => (
  props: PropsWithChildren<{}>
) => {
  const Provider = providers[0];
  if (!providers.length) {
    return <>{props.children}</>;
  }
  if (providers.length === 1) {
    const Provider = providers[0];
    return <Provider {...props} />;
  } else {
    const NextProvider = combineCtxProvider(providers.slice(1));
    return (
      <Provider>
        <NextProvider {...props} />
      </Provider>
    );
  }
};
export default combineCtxProvider;
