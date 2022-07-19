import { auth } from './const';
import { apiFetch, apiDelete } from './requests';
import { Occurrence, Country, Service, Location, Basic, Trainer, TrainerActivity, Timeslot } from './data';
import { remove } from '../utils/IonicStorage';

export const compareObjects = (object1: any, object2: any, key: string) => {
  const obj1 = object1[key].toUpperCase()
  const obj2 = object2[key].toUpperCase()

  if (obj1 < obj2) {
    return -1
  }
  if (obj1 > obj2) {
    return 1
  }
  return 0
}

export const clearFilters = async () => {
  await remove('classes');
  await remove('locations');
  await remove('location_ids');
  await remove('class_types');
  await remove('instructors');
}

export const mapToNames = async ( arr: TrainerActivity[] ) => {
  let byNames: { [id: string]: TrainerActivity[] } = {};
  arr.map((item) => {
    if(Object.keys(byNames).find((title) => {
      return title === item.service.service_title;
    })) {
      byNames[item.service.service_title].push(item);
    }
    else {
      byNames[item.service.service_title] = [item];
    }
  })
  return byNames;
}


export const fetchUserData = async () => {
  try {
    let data = await apiFetch("/api/unified/users/profile", '');
    if(data) {
      console.log(data)
      if (data.user !== undefined) {
        return data.user;
      }
    }
    else {
      return false;
    }
  }
  catch(e) {
    return false;
  }
};

export const fetchSettings = async () => {
    let data = await apiFetch("/api/unified/clubs/settings");
    if(data) {
      console.log(data)
      if (data.settings !== undefined) {
        return data.settings;
      }
    }
    else {
      return false;
    }
};

export const fetchOccurrences = async (params: string = "") => {
    let data = await apiFetch("/api/unified/schedule/occurrences.json", params);
    if (data !== undefined) {
      let occurrences: Occurrence[] = [];
      await data.occurrences.forEach((item: any) => {
        if (
          item.id !== undefined &&
          item.service_title !== undefined &&
          item.duration_in_hours !== undefined &&
          item.duration_in_minutes !== undefined &&
          item.group_size !== 1
        ) {
          occurrences.push(item);
        }
      });
      return occurrences;
    }
};

export const fetchCountries = async () => {
    let data = await apiFetch("/api/unified/lookups/countries");
    if (data !== undefined) {
      let countries: Country[] = [];
      await data.countries.forEach((item: any) => {
        if (
          item.id !== undefined &&
          item.name !== undefined
        ) {
          countries.push(item);
        }
      });
      return countries;
    }
};

export const fetchServices = async (params: string = "") => {
  let data = await apiFetch("/api/unified/services/services", params);
  console.log(data);
  if (data !== undefined) {
    let classes: Service[] = [];
    await data.services.forEach((item: any) => {
      if (
        item.id !== undefined &&
        item.service_title !== undefined
      ) {
        classes.push(item);
      }
    });
    return classes;
  }
}

export const fetchLocations = async (params: string = "") => {
  let data = await apiFetch("/api/unified/clubs/locations.json", params);
  if (data !== undefined) {
    return data.locations;
  }
};

export const fetchRegions = async (params: string = "") => {
  let data = await apiFetch("/api/unified/clubs/regions.json", params);
  if (data !== undefined) {
    let regions: Basic[] = [];
    await data.regions.forEach((item: any) => {
      if (
        item.id !== undefined &&
        item.name !== undefined
      ) {
        let region: Basic = {
          id: item.id,
          name: item.name
        };
        regions.push(region);
      }
    });
    return regions;
  }
};

export const fetchClassTypes = async () => {
  let data = await apiFetch("/api/unified/services/activity_categories.json");
  if (data !== undefined) {
    let classTypes: Basic[] = [];
    await data.activity_categories.forEach((item: any) => {
      if (
        item.id !== undefined &&
        item.name !== undefined
      ) {
        let classType: Basic = {
          id: item.id,
          name: item.name
        };
        classTypes.push(classType);
      }
    });
    return classTypes;
  }
}

export const fetchTrainers = async (params: string = "") => {
  let data = await apiFetch("/api/unified/users/trainers.json", params);
  if (data !== undefined) {
    let trainers: Trainer[] = [];
    await data.trainers.forEach((item: any) => {
      if (
        item.id !== undefined &&
        item.name !== undefined
      ) {
        trainers.push(item);
      }
    });
    return trainers;
  }
}

export const fetchTrainerData = async (id: number) => {
  let data = await apiFetch("/api/unified/users/trainers/" + id);
  if (data !== undefined) {
    return data.trainer;
  }
}

export const fetchTrainerActivities = async (params: string = "") => {
  let data = await apiFetch("/api/unified/services/trainer_activities.json" + params);
  if (data !== undefined) {
    let trainerActivities: TrainerActivity[] = [];
    await data.trainer_activities.forEach((item: any) => {
      if (
        item.id !== undefined
      ) {
        trainerActivities.push(item);
      }
    });
    return trainerActivities;
  }
}

export const fetchClientPackages = async (params: string = "") => {
  let data = await apiFetch("/api/unified/services/client_service_packages" + params);
  if(data !== undefined) {
    return data.client_service_packages;
  }
}

export const fetchTransactions = async (params: string = '') => {
  let data = await apiFetch('/api/unified/transactions/money' + params);
  if(data !== undefined) {
    return data.data;
  }
}

export const fetchSections = async () => {
  let data = await apiFetch("/api/unified/clubs/mobile_applications/settings");
  if (data !== undefined) {
    return data.sections;
  }
}

export const fetchTimeslots = async (params: string = "") => {
  let data = await apiFetch("/api/unified/schedule/appointments/1/time_slots" + params);
  if (data !== undefined) {
    console.log(data.time_slots);
    let timeslots: Timeslot[] = [];
    await data.time_slots.forEach((item: any) => {
      if (
        item.since !== undefined &&
        item.till !== undefined
      ) {
        let timeslot: Timeslot = {
          since: item.since,
          till: item.till,
          trainer_activity: [item.trainer_activity]
        };
        timeslots.push(timeslot);
      }
    });
    return timeslots;
  }
}

export const fetchPackages = async (params: string = "") => {
  let data = await apiFetch("/api/unified/services/service_packages" + params);
  if(data !== undefined) {
    return data.service_packages;
  }
}

export const fetchNotifications = async () => {
  let data = await apiFetch('/api/unified/settings/notification_settings_sets/personal');
  if(data !== undefined) {
    return data.notification_settings_set;
  }
}

export const fetchLinked = async () => {
  let data = await apiFetch('/api/unified/users/clients/linked');
  if(data !== undefined) {
    return data.clients;
  }
}

export const fetchPackageShow = async (id: number) => {
  let data = await apiFetch('/api/unified/services/service_packages/' + id);
  if(data !== undefined) {
    return data.service_package;
  }
}

export const fetchClient = async (id: number) => {
  let data = await apiFetch('/api/unified/users/clients/' + id);
  if(data !== undefined) {
    console.log(data);
  }
}

export const fetchSpreedly = async (order_id: number, payment_provider='spreedly_test') => {
  var myHeaders = new Headers();
  // myHeaders.append("Authorization", this.props.authToken);
  myHeaders.append("X-Fisikal-Token", auth.fisikal_token);
  // myHeaders.append("Content-Type", "text/html");
  myHeaders.append("Access-Control-Allow-Origin", "http://localhost:3000/");
  myHeaders.append("Accept", "text/html");
  myHeaders.append("Accept-Encoding", "gzip, deflate, br");
  myHeaders.append("Connection", "keep-alive");
  var requestOptions: RequestInit = {
    // credentials: 'include',
    headers: myHeaders,
    method: "GET",  
  };

  try {
    let data = await fetch(
      auth.url + '/api/mobile/spreedly_express/init_flow/' + order_id + '.json?payment_provider=' + payment_provider + '&url_schema=/payment',
      requestOptions
    )
    if (data.status < 400 || data.status >= 600) {
      let response = data.json();
      console.log(response);
      console.log("getFetch success");
      // console.log(response);
      return response;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
  // let data = await apiFetch('/api/mobile/spreedly_express/init_flow/' + order_id + '?payment_provider=' + payment_provider + '&url_schema=Ionic_app');
  // console.log(data);
  // return data;
}

export const deleteOccurence = async (id: number, client_id: number) => {
  let body = {
    client_id: client_id
  };
  let data = await apiDelete('/api/unified/schedule/occurrences/' + id + '/cancel', body);
  if(data !== undefined) {
    return data.occurence;
  }
}