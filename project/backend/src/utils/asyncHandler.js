const asyncHandler = (fn)=> {
    (req,res,next)=> {
        Promise.resolve(
            fn(req,res,next)).
            catch((err)=> next(err))
    }
}

export {asyncHandler}

// const asyncHandler = () => {}
// const asyncHandler = (func) => {()=> {}} // a function is passed to another function
// const asyncHandler = (func) => () => {} // {} removed
// const asyncHandler = (func) => async() => {} // {} async

// const asyncHandler = (fn) => async(req,res,next) => {
//     try {
//         await fn(req,res,next)
//     } catch (err) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         });
//     }
// }