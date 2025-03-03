export const formatPostDate = (createAt) => {
    const currentDate = new Date();
    const createdAtDate = new Date(createdAt);

    const timeDifferenceInSeconds = Math.floor((currentDate - createdAtDate) / 1000);
    const timeDifferenceInMinunes = Math.floor(timeDifferenceInSeconds/ 60);
    const timeDifferenceInHours = Math.floor(timeDifferenceInMinunes/ 60);
    const timeDifferenceInDay = Math.floor(timeDifferenceInHours / 24);

    if(timeDifferenceInDay > 1){
        return createdAtDate.toLocaleDateString("en-us",{month: "short",day:"numeric"});
    } else if(timeDifferenceInDay === 1) {
        return "1d"
    } else if (timeDifferenceInHours >=1 ){
        return `${timeDifferenceInHours}h`
    } else if(timeDifferenceInMinunes >= 1){
        return `${timeDiffernceMinunes}m`
    } else {
        return "Just now "
    }
}

export const formatMemberSinceDate = (createdAt) => {
    const date = new Date(createdAt);
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `joined ${month} ${year}`
}

export default formatPostDate;