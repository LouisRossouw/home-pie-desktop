import { UserSession } from '@shared/types'
import { useApp } from '~/libs//context/app'

// TODO; Can we get the userSession type from open api?

export function useLogin() {
  const { setIsAuth } = useApp()

  const loginUser = (data: any) => {
    const userSession = {
      email: data.user.email,
      userId: data?.user?.id,
      firstName: data.user.first_name,
      lastName: data.user.last_name,
      is_staff: data.user.is_staff ?? false, // todo
      auth_type: data.user.auth_type ?? undefined // todo
    } as UserSession

    // const success = saveUserToStorage(data, userSession);

    // if (success) {
    //   setIsAuth(true)
    //   // setUser(userSession);
    // }
  }

  return loginUser
}
