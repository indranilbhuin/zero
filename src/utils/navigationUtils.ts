import {NavigationContainerRef, CommonActions} from '@react-navigation/native';

let navigationRef: NavigationContainerRef<any> | null = null;

export const setNavigationRef = (ref: NavigationContainerRef<any>) => {
  navigationRef = ref;
};

export const navigate = (name: string, params?: object) => {
  if (navigationRef) {
    navigationRef.dispatch(CommonActions.navigate({name, params}));
  } else {
    console.error(
      'Navigation reference is not set. Make sure to call setNavigationRef.',
    );
  }
};

export const goBack = (action?: () => any) => {
  if (navigationRef) {
    navigationRef.dispatch(CommonActions.goBack());
  } else {
    console.error(
      'Navigation reference is not set. Make sure to call setNavigationRef.',
    );
  }
  if (typeof action === 'function') {
    action();
  }
};
