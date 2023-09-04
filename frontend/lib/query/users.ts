import axios from "axios";
import { UserValues } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "react-query";

const BASE_URL = process.env.NEXT_PUBLIC_API_HOST;
const USERS_URL = `${BASE_URL}/${process.env.NEXT_PUBLIC_API_USERS_PATH}`;
console.log(BASE_URL);
// create axios base url
const axiosUsersAPI = axios.create({
  baseURL: USERS_URL,
});

// get all users
export async function getUsers(): Promise<UserValues[]> {
  return axiosUsersAPI.get("/").then((response) => response.data);
}

// get user by id
export async function getUserById(id: string): Promise<UserValues> {
  return axiosUsersAPI.get(`/${id}`).then((response) => response.data);
}

// get user by email
export async function getUserByEmail(email: string): Promise<UserValues> {
  return axiosUsersAPI
    .post("/email", { email })
    .then((response) => response.data);
}

// create user
export async function createUser(data: FormData): Promise<UserValues> {
  return axiosUsersAPI.post("/create", data).then((response) => response.data);
}

// update user
export async function updateUser(
  id: number,
  data: FormData
): Promise<UserValues> {
  return axiosUsersAPI
    .post(`/update/${id}`, data)
    .then((response) => response.data);
}

// update user password
export async function updateUserPassword(data: FormData): Promise<UserValues> {
  return axiosUsersAPI
    .post(`/update/password`, data)
    .then((response) => response.data);
}

// update profile
export async function updateProfile(data: FormData): Promise<UserValues> {
  return axiosUsersAPI
    .post("/update/profile", data)
    .then((response) => response.data);
}

// delete user
export async function deleteUser(id: string): Promise<any> {
  return axiosUsersAPI.post(`/delete/${id}`).then((response) => response.data);
}

export const useGetUsers = () => {
  return useQuery("users", getUsers);
};

export const useGetUserById = (id: string) => {
  return useQuery(["user", id], () => getUserById(id), {
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation((data: FormData) => createUser(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: FormData) => updateUser(Number(data.get("id")), data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    }
  );
};

export const useUpdateUserPassword = () => {
  const queryClient = useQueryClient();

  return useMutation((data: FormData) => updateUserPassword(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation((data: FormData) => updateProfile(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation((id: string) => deleteUser(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
    },
  });
};
