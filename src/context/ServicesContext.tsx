import React, { createContext, useContext, useState, ReactNode } from "react";

export const ALL_SERVICE_IDS = [
  "youtube",
  "yandex",
  "spotify",
  "vk",
  "soundcloud",
  "lastfm",
  "local",
];

interface ServicesContextType {
  enabledServices: string[];
  setEnabledServices: (services: string[]) => void;
  toggleService: (serviceId: string) => void;
}

const ServicesContext = createContext<ServicesContextType | undefined>(
  undefined,
);

export const ServicesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [enabledServices, setEnabledServicesState] = useState<string[]>(() => {
    const saved = localStorage.getItem("melomash_enabled_services");
    return saved ? JSON.parse(saved) : ALL_SERVICE_IDS;
  });

  const setEnabledServices = (services: string[]) => {
    setEnabledServicesState(services);
    localStorage.setItem("melomash_enabled_services", JSON.stringify(services));
  };

  const toggleService = (serviceId: string) => {
    setEnabledServicesState((prev) => {
      let next;
      if (prev.includes(serviceId)) {
        if (prev.length <= 1) return prev;
        next = prev.filter((id) => id !== serviceId);
      } else {
        next = [...prev, serviceId];
      }
      localStorage.setItem("melomash_enabled_services", JSON.stringify(next));
      return next;
    });
  };

  return (
    <ServicesContext.Provider
      value={{ enabledServices, setEnabledServices, toggleService }}
    >
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error("useServices must be used within a ServicesProvider");
  }
  return context;
};
