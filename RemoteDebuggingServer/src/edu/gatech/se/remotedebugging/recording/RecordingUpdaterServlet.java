package edu.gatech.se.remotedebugging.recording;

import java.io.IOException;
import java.net.UnknownHostException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;

public class RecordingUpdaterServlet extends HttpServlet {
	 private MongoClient mongoClient = null;
	 private DB db = null;
	 private DBCollection collection = null;

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public void init() throws ServletException {
		try {
			mongoClient = new MongoClient();
			db = mongoClient.getDB("remotedebugging");
			collection = db.getCollection("recordings");
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String targetMachine = getClientIP(req);
		String logId = req.getParameter("logId");
		String withException = req.getParameter("withException");
		String codeVersion = req.getParameter("codeVersion");
		
		BasicDBObject query = new BasicDBObject("targetMachine", targetMachine)
		                      .append("logId", logId);
	
		BasicDBObject doc = new BasicDBObject("targetMachine", targetMachine).
                append("logId", logId).
                append("withException", withException).
                append("codeVersion", codeVersion);
		
		collection.update(query, doc, true, false);
	}
	
	private String getClientIP(HttpServletRequest request){
		String ip = request.getHeader("X-Forwarded-For");  
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
            ip = request.getHeader("Proxy-Client-IP");  
        }  
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
            ip = request.getHeader("WL-Proxy-Client-IP");  
        }  
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
            ip = request.getHeader("HTTP_CLIENT_IP");  
        }  
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");  
        }  
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
            ip = request.getRemoteAddr();  
        }  
        
        return ip;  
	}

}
