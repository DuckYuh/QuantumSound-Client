
import { invoke } from "@tauri-apps/api/core";

function isTauri(): boolean {
  return (
    typeof window !== "undefined" &&
    "__TAURI_INTERNALS__" in window
  );
}

export const authTokens = {
  async getAccessToken(): Promise<string | null> {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  },

  async setAccessToken(token: string): Promise<void> {
    localStorage.setItem("access_token", token);
  },

  async getRefreshToken(): Promise<string | null> {
    if (typeof window === "undefined") return null;

    if (isTauri()) {
      return invoke<string | null>("get_refresh_token");
    }

    return localStorage.getItem("refresh_token");
  },

  async setRefreshToken(token: string): Promise<void> {
    if (isTauri()) {
      await invoke("save_refresh_token", { token });
      return;
    }

    localStorage.setItem("refresh_token", token);
  },

  async clear(): Promise<void> {
    if (typeof window === "undefined") return;

    localStorage.removeItem("access_token");

    if (isTauri()) {
      await invoke("delete_refresh_token");
    } else {
      localStorage.removeItem("refresh_token");
    }
  },
};