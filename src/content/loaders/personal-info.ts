interface PersonalInfo {
  name: string;
  position: string;
  description: string;
  startsYear: number;
}

const getPersonalInfo = (): Promise<PersonalInfo> => {
  return new Promise((resolve) => {
    const startsYear = import.meta.env.WORK_STARTS_YEAR ?? 2021;
    const description = `Desarrollador Backend con más de ${calculateExperienceYears(startsYear)} años de experiencia \
    en el desarrollo de productos escalables con PHP`;

    resolve({
      name: "Alejandro Acosta",
      position: "Backend Developer",
      description,
      startsYear,
    });
  });
};

const calculateExperienceYears = (starts: number): number => {
  return new Date().getFullYear() - starts;
};

export { getPersonalInfo };
