interface PersonalInfo {
  name: string;
  position: string;
  description: string;
  startsYear: number;
  years: number;
}

const getPersonalInfo = (): Promise<PersonalInfo> => {
  return new Promise((resolve) => {
    const startsYear = import.meta.env.WORK_STARTS_YEAR ?? 2021;
    const years = calculateExperienceYears(startsYear);

    const description = `Desarrollador Backend con más de ${years} años de experiencia \
    en el desarrollo de productos escalables con PHP`;

    resolve({
      name: "Alejandro Acosta",
      position: "Backend Developer",
      description,
      startsYear,
      years: years,
    });
  });
};

const calculateExperienceYears = (starts: number): number => {
  return new Date().getFullYear() - starts;
};

export { getPersonalInfo };
