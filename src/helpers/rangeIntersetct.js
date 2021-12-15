export default (arr1 = [], arr2 = []) => {
    const [min1, max1] = arr1;
    const [min2, max2] = arr2;
    return (min1 >= min2 && min1 <= max2) || (max1 >= min2 && max1 <= max2)
    || (min2 >= min1 && min2 <= max1) || (max2 >= min1 && max2 <= max1)
};
