
export const hostApi = process.env.API_BACKEND;

export function buildApi(path = "") {
	if (!path.startsWith("/")) {
		path = `/${path}`;
	}
	return `${hostApi}${path}`;
}

export const accessTokenKey = "knfsAccessToken";
export const refreshTokenKey = "refreshToken";
export const currentUserKey = "currentUser";
export const tmpCurrentUserKey = "tmpCurrentUser"

export const roles = [
	"user",
];