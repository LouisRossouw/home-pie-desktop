import { CustomToken } from '@shared/types'
import { useApp } from '~/libs//context/app'

// TODO; Can we get the userSession type from open api?

export function useLogin() {
  const { setIsAuth } = useApp()

  const loginUser = (data: CustomToken) => {
    const userSession = {
      email: data.user.email,
      id: data?.user?.id,
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      isStaff: data.user.isStaff ?? false, // todo
      authType: data.user.authType ?? undefined // todo
    }

    // const success = saveUserToStorage(data, userSession);

    // if (success) {
    //   setIsAuth(true)
    //   // setUser(userSession);
    // }
  }

  return loginUser
}
